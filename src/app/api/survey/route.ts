import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createClient, type Client } from '@libsql/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type YesNo = 'yes' | 'no'
type IncidentFrequency = '0' | '1' | '2-3' | '4+'
type RcaDuration = '<30m' | '30-120m' | '2-8h' | '>8h'
type DecisionVersionChain = 'full' | 'partial' | 'none'

type SurveyPayload = {
  fullName: string
  workEmail: string
  company: string
  roleTitle?: string
  segment: string
  incidentInLast30Days: YesNo
  workflowName?: string
  impacts?: string[]
  replayRcaDuration?: RcaDuration
  decisionVersionChain?: DecisionVersionChain
  costEstimate?: string
  incidentFrequency?: IncidentFrequency
  integrationOwnerAvailable: YesNo
  pilotOwner?: string
  notes?: string
  consent: boolean
  website?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  sourceUrl?: string
}

type SurveyRecord = SurveyPayload & {
  id: string
  createdAt: string
  ip: string
  userAgent: string
}

const VALID_SEGMENTS = new Set(['Platform', 'SRE/DevOps', 'Support Ops', 'Other'])
const VALID_IMPACTS = new Set([
  'User impact',
  'Operational delay',
  'Revenue/cost impact',
  'Deploy/release blockage',
])
const VALID_RCA_DURATIONS = new Set<RcaDuration>(['<30m', '30-120m', '2-8h', '>8h'])
const VALID_FREQUENCIES = new Set<IncidentFrequency>(['0', '1', '2-3', '4+'])
const VALID_VERSION_CHAIN = new Set<DecisionVersionChain>(['full', 'partial', 'none'])

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

const ipBuckets = new Map<string, { count: number; windowStart: number }>()
let tursoClient: Client | null = null
let schemaReady: Promise<void> | null = null

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const bucket = ipBuckets.get(ip)

  if (!bucket) {
    ipBuckets.set(ip, { count: 1, windowStart: now })
    return true
  }

  if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now })
    return true
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  bucket.count += 1
  return true
}

function validatePayload(payload: unknown): { valid: boolean; errors: string[]; data?: SurveyPayload } {
  const errors: string[] = []
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Invalid payload.'] }
  }

  const obj = payload as Record<string, unknown>

  const fullName = normalizeText(obj.fullName)
  const workEmail = normalizeText(obj.workEmail)
  const company = normalizeText(obj.company)
  const roleTitle = normalizeText(obj.roleTitle)
  const segment = normalizeText(obj.segment)
  const incidentInLast30Days = normalizeText(obj.incidentInLast30Days) as YesNo
  const workflowName = normalizeText(obj.workflowName)
  const impacts = Array.isArray(obj.impacts) ? obj.impacts.filter((v) => typeof v === 'string') : []
  const replayRcaDuration = normalizeText(obj.replayRcaDuration) as RcaDuration
  const decisionVersionChain = normalizeText(obj.decisionVersionChain) as DecisionVersionChain
  const costEstimate = normalizeText(obj.costEstimate)
  const incidentFrequency = normalizeText(obj.incidentFrequency) as IncidentFrequency
  const integrationOwnerAvailable = normalizeText(obj.integrationOwnerAvailable) as YesNo
  const pilotOwner = normalizeText(obj.pilotOwner)
  const notes = normalizeText(obj.notes)
  const consent = Boolean(obj.consent)
  const website = normalizeText(obj.website)
  const utmSource = normalizeText(obj.utmSource)
  const utmMedium = normalizeText(obj.utmMedium)
  const utmCampaign = normalizeText(obj.utmCampaign)
  const sourceUrl = normalizeText(obj.sourceUrl)

  if (!fullName) errors.push('Full name is required.')
  if (!workEmail) errors.push('Work email is required.')
  if (workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    errors.push('Work email format is invalid.')
  }
  if (!company) errors.push('Company is required.')
  if (!VALID_SEGMENTS.has(segment)) errors.push('Segment value is invalid.')
  if (incidentInLast30Days !== 'yes' && incidentInLast30Days !== 'no') {
    errors.push('incidentInLast30Days must be yes or no.')
  }
  if (integrationOwnerAvailable !== 'yes' && integrationOwnerAvailable !== 'no') {
    errors.push('integrationOwnerAvailable must be yes or no.')
  }
  if (!consent) errors.push('Consent is required.')
  if (website) errors.push('Spam detected.')

  if (incidentInLast30Days === 'yes') {
    if (!workflowName) errors.push('workflowName is required when incidentInLast30Days is yes.')
    if (!VALID_RCA_DURATIONS.has(replayRcaDuration)) errors.push('replayRcaDuration value is invalid.')
    if (!VALID_VERSION_CHAIN.has(decisionVersionChain)) errors.push('decisionVersionChain value is invalid.')
    if (!VALID_FREQUENCIES.has(incidentFrequency)) errors.push('incidentFrequency value is invalid.')
    if (impacts.length === 0) errors.push('At least one impact is required.')
    if (impacts.some((impact) => !VALID_IMPACTS.has(impact))) {
      errors.push('One or more impacts are invalid.')
    }
  }

  if (integrationOwnerAvailable === 'yes' && !pilotOwner) {
    errors.push('pilotOwner is required when integrationOwnerAvailable is yes.')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: {
      fullName,
      workEmail,
      company,
      roleTitle,
      segment,
      incidentInLast30Days,
      workflowName,
      impacts,
      replayRcaDuration,
      decisionVersionChain,
      costEstimate,
      incidentFrequency,
      integrationOwnerAvailable,
      pilotOwner,
      notes,
      consent,
      website,
      utmSource,
      utmMedium,
      utmCampaign,
      sourceUrl,
    },
  }
}

async function appendSubmission(record: object) {
  const outDir = path.join(process.cwd(), 'data')
  const outFile = path.join(outDir, 'survey-submissions.ndjson')
  await fs.mkdir(outDir, { recursive: true })
  await fs.appendFile(outFile, `${JSON.stringify(record)}\n`, 'utf8')
}

function getTursoClient(): Client | null {
  if (tursoClient) return tursoClient

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url || !authToken) return null

  tursoClient = createClient({ url, authToken })
  return tursoClient
}

async function ensureSchema(client: Client) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS survey_submissions (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          ip TEXT NOT NULL,
          user_agent TEXT NOT NULL,
          full_name TEXT NOT NULL,
          work_email TEXT NOT NULL,
          company TEXT NOT NULL,
          role_title TEXT NOT NULL,
          segment TEXT NOT NULL,
          incident_in_last_30_days TEXT NOT NULL,
          workflow_name TEXT NOT NULL,
          impacts_json TEXT NOT NULL,
          replay_rca_duration TEXT NOT NULL,
          decision_version_chain TEXT NOT NULL,
          cost_estimate TEXT NOT NULL,
          incident_frequency TEXT NOT NULL,
          integration_owner_available TEXT NOT NULL,
          pilot_owner TEXT NOT NULL,
          notes TEXT NOT NULL,
          consent INTEGER NOT NULL,
          utm_source TEXT NOT NULL,
          utm_medium TEXT NOT NULL,
          utm_campaign TEXT NOT NULL,
          source_url TEXT NOT NULL
        )
      `)
      await client.execute(`
        CREATE INDEX IF NOT EXISTS idx_survey_submissions_created_at
        ON survey_submissions (created_at)
      `)
      await client.execute(`
        CREATE INDEX IF NOT EXISTS idx_survey_submissions_work_email
        ON survey_submissions (work_email)
      `)
    })()
  }
  return schemaReady
}

async function persistSubmission(record: SurveyRecord): Promise<'turso' | 'ndjson'> {
  const client = getTursoClient()
  if (!client) {
    await appendSubmission(record)
    return 'ndjson'
  }

  await ensureSchema(client)
  await client.execute({
    sql: `
      INSERT INTO survey_submissions (
        id, created_at, ip, user_agent, full_name, work_email, company, role_title, segment,
        incident_in_last_30_days, workflow_name, impacts_json, replay_rca_duration,
        decision_version_chain, cost_estimate, incident_frequency, integration_owner_available,
        pilot_owner, notes, consent, utm_source, utm_medium, utm_campaign, source_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      record.id,
      record.createdAt,
      record.ip,
      record.userAgent,
      record.fullName,
      record.workEmail,
      record.company,
      record.roleTitle ?? '',
      record.segment,
      record.incidentInLast30Days,
      record.workflowName ?? '',
      JSON.stringify(record.impacts ?? []),
      record.replayRcaDuration ?? '',
      record.decisionVersionChain ?? '',
      record.costEstimate ?? '',
      record.incidentFrequency ?? '',
      record.integrationOwnerAvailable,
      record.pilotOwner ?? '',
      record.notes ?? '',
      record.consent ? 1 : 0,
      record.utmSource ?? '',
      record.utmMedium ?? '',
      record.utmCampaign ?? '',
      record.sourceUrl ?? '',
    ],
  })
  return 'turso'
}

async function sendWebhook(record: object) {
  const webhookUrl = process.env.SURVEY_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.error(`Survey webhook failed with status ${response.status}`)
    }
  } catch (err) {
    console.error('Survey webhook request failed', err)
  }
}

export async function POST(request: NextRequest) {
  const ip = getIp(request)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const result = validatePayload(payload)
  if (!result.valid || !result.data) {
    return NextResponse.json({ error: result.errors.join(' ') || 'Validation failed.' }, { status: 400 })
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip,
    userAgent: request.headers.get('user-agent') ?? '',
    ...result.data,
  }

  let persistedBy: 'turso' | 'ndjson' = 'ndjson'
  try {
    persistedBy = await persistSubmission(record)
  } catch (err) {
    console.error('Failed to persist survey submission', err)
    return NextResponse.json({ error: 'Submission could not be saved.' }, { status: 500 })
  }

  await sendWebhook(record)

  return NextResponse.json(
    {
      message: 'Submission recorded. We will review and follow up if relevant.',
      submissionId: record.id,
      persistedBy,
    },
    { status: 201 }
  )
}
