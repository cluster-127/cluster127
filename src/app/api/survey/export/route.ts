import { promises as fs } from 'node:fs'
import path from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import { createClient, type Client } from '@libsql/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type PersistedBy = 'turso' | 'ndjson'
type ExportFormat = 'json' | 'csv' | 'markdown'

type SurveyExportRecord = {
  id: string
  createdAt: string
  ip: string
  userAgent: string
  fullName: string
  workEmail: string
  company: string
  roleTitle: string
  segment: string
  incidentInLast30Days: string
  workflowName: string
  impacts: string[]
  replayRcaDuration: string
  decisionVersionChain: string
  costEstimate: string
  incidentFrequency: string
  integrationOwnerAvailable: string
  pilotOwner: string
  notes: string
  consent: boolean
  utmSource: string
  utmMedium: string
  utmCampaign: string
  sourceUrl: string
}

let tursoClient: Client | null = null
let schemaReady: Promise<void> | null = null

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
    })()
  }
  return schemaReady
}

function isAuthorized(request: NextRequest): boolean {
  const configuredToken = process.env.SURVEY_EXPORT_TOKEN?.trim()
  if (!configuredToken) return false

  const authHeader = request.headers.get('authorization')?.trim() ?? ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const headerToken = request.headers.get('x-export-token')?.trim() ?? ''
  return [bearerToken, headerToken].some((token) => secureEqual(token, configuredToken))
}

function secureEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '100', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return 100
  return Math.min(parsed, 1000)
}

function parseFormat(value: string | null): ExportFormat {
  if (value === 'csv' || value === 'markdown') return value
  return 'json'
}

function isValidIsoDate(value: string): boolean {
  const t = Date.parse(value)
  return Number.isFinite(t)
}

function mapDbRowToRecord(row: Record<string, unknown>): SurveyExportRecord {
  const impactsRaw = typeof row.impacts_json === 'string' ? row.impacts_json : '[]'
  let impacts: string[] = []
  try {
    const parsed = JSON.parse(impactsRaw)
    if (Array.isArray(parsed)) impacts = parsed.filter((item) => typeof item === 'string')
  } catch {
    impacts = []
  }

  return {
    id: String(row.id ?? ''),
    createdAt: String(row.created_at ?? ''),
    ip: String(row.ip ?? ''),
    userAgent: String(row.user_agent ?? ''),
    fullName: String(row.full_name ?? ''),
    workEmail: String(row.work_email ?? ''),
    company: String(row.company ?? ''),
    roleTitle: String(row.role_title ?? ''),
    segment: String(row.segment ?? ''),
    incidentInLast30Days: String(row.incident_in_last_30_days ?? ''),
    workflowName: String(row.workflow_name ?? ''),
    impacts,
    replayRcaDuration: String(row.replay_rca_duration ?? ''),
    decisionVersionChain: String(row.decision_version_chain ?? ''),
    costEstimate: String(row.cost_estimate ?? ''),
    incidentFrequency: String(row.incident_frequency ?? ''),
    integrationOwnerAvailable: String(row.integration_owner_available ?? ''),
    pilotOwner: String(row.pilot_owner ?? ''),
    notes: String(row.notes ?? ''),
    consent: Number(row.consent ?? 0) === 1,
    utmSource: String(row.utm_source ?? ''),
    utmMedium: String(row.utm_medium ?? ''),
    utmCampaign: String(row.utm_campaign ?? ''),
    sourceUrl: String(row.source_url ?? ''),
  }
}

async function fetchFromTurso(limit: number, since: string | null): Promise<SurveyExportRecord[]> {
  const client = getTursoClient()
  if (!client) return []

  await ensureSchema(client)
  const args: Array<string | number> = []
  let sql = `
    SELECT
      id, created_at, ip, user_agent, full_name, work_email, company, role_title, segment,
      incident_in_last_30_days, workflow_name, impacts_json, replay_rca_duration,
      decision_version_chain, cost_estimate, incident_frequency, integration_owner_available,
      pilot_owner, notes, consent, utm_source, utm_medium, utm_campaign, source_url
    FROM survey_submissions
  `
  if (since) {
    sql += ' WHERE created_at >= ?'
    args.push(since)
  }
  sql += ' ORDER BY created_at DESC LIMIT ?'
  args.push(limit)

  const result = await client.execute({ sql, args })
  return result.rows.map((row) => mapDbRowToRecord(row as Record<string, unknown>))
}

async function fetchFromNdjson(limit: number, since: string | null): Promise<SurveyExportRecord[]> {
  const filePath = path.join(process.cwd(), 'data', 'survey-submissions.ndjson')
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0)

    const parsed = lines
      .map((line) => {
        try {
          return JSON.parse(line) as SurveyExportRecord
        } catch {
          return null
        }
      })
      .filter((record): record is SurveyExportRecord => Boolean(record))
      .filter((record) => (since ? record.createdAt >= since : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return parsed.slice(0, limit)
  } catch {
    return []
  }
}

function guessPilotLikelihood(record: SurveyExportRecord): number {
  if (record.integrationOwnerAvailable === 'yes' && record.incidentInLast30Days === 'yes') {
    if (record.incidentFrequency === '4+' || record.incidentFrequency === '2-3') return 5
    return 4
  }
  if (record.integrationOwnerAvailable === 'yes') return 3
  if (record.incidentInLast30Days === 'yes') return 2
  return 1
}

function toInterviewMarkdown(records: SurveyExportRecord[]): string {
  const lines: string[] = []
  lines.push('# Survey Export (Interview Log Draft)')
  lines.push('')
  lines.push(
    '| ID | Date | Segment | Role | Workflow | Replay/Debug Pain (Y/N) | Pain Cost Estimate | Pilot Likelihood (1-5) | Notes Link |'
  )
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')

  records.forEach((record, index) => {
    const interviewId = `INT-${String(index + 1).padStart(3, '0')}`
    const date = record.createdAt.slice(0, 10)
    const pain = record.incidentInLast30Days === 'yes' ? 'Y' : 'N'
    const notesLink = record.sourceUrl || 'TBD'
    lines.push(
      `| ${interviewId} | ${date || 'TBD'} | ${record.segment || 'TBD'} | ${record.roleTitle || 'TBD'} | ${record.workflowName || 'TBD'} | ${pain} | ${record.costEstimate || 'TBD'} | ${guessPilotLikelihood(record)} | ${notesLink} |`
    )
  })

  if (records.length === 0) {
    lines.push('| INT-001 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |')
  }

  lines.push('')
  return lines.join('\n')
}

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

function toCsv(records: SurveyExportRecord[]): string {
  const headers = [
    'id',
    'createdAt',
    'fullName',
    'workEmail',
    'company',
    'roleTitle',
    'segment',
    'incidentInLast30Days',
    'workflowName',
    'impacts',
    'replayRcaDuration',
    'decisionVersionChain',
    'costEstimate',
    'incidentFrequency',
    'integrationOwnerAvailable',
    'pilotOwner',
    'notes',
    'utmSource',
    'utmMedium',
    'utmCampaign',
    'sourceUrl',
  ]
  const rows = [headers.join(',')]
  for (const record of records) {
    const values = [
      record.id,
      record.createdAt,
      record.fullName,
      record.workEmail,
      record.company,
      record.roleTitle,
      record.segment,
      record.incidentInLast30Days,
      record.workflowName,
      record.impacts.join('|'),
      record.replayRcaDuration,
      record.decisionVersionChain,
      record.costEstimate,
      record.incidentFrequency,
      record.integrationOwnerAvailable,
      record.pilotOwner,
      record.notes,
      record.utmSource,
      record.utmMedium,
      record.utmCampaign,
      record.sourceUrl,
    ].map((value) => escapeCsv(value ?? ''))
    rows.push(values.join(','))
  }
  return `${rows.join('\n')}\n`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error:
          'Unauthorized export request. Set SURVEY_EXPORT_TOKEN and pass it via Authorization: Bearer <token> or x-export-token.',
      },
      { status: 401 }
    )
  }

  const format = parseFormat(request.nextUrl.searchParams.get('format'))
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'))
  const since = request.nextUrl.searchParams.get('since')
  if (since && !isValidIsoDate(since)) {
    return NextResponse.json({ error: 'Invalid since parameter. Use ISO date/time.' }, { status: 400 })
  }

  let records: SurveyExportRecord[] = []
  let persistedBy: PersistedBy = 'ndjson'

  try {
    records = await fetchFromTurso(limit, since)
    if (records.length > 0) {
      persistedBy = 'turso'
    } else {
      records = await fetchFromNdjson(limit, since)
      persistedBy = 'ndjson'
    }
  } catch (err) {
    console.error('Survey export fetch failed', err)
    return NextResponse.json({ error: 'Failed to fetch survey submissions.' }, { status: 500 })
  }

  const generatedAt = new Date().toISOString()
  if (format === 'csv') {
    return new NextResponse(toCsv(records), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey-export-${generatedAt.slice(0, 10)}.csv"`,
        'X-Survey-Persisted-By': persistedBy,
      },
    })
  }

  if (format === 'markdown') {
    return new NextResponse(toInterviewMarkdown(records), {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey-export-${generatedAt.slice(0, 10)}.md"`,
        'X-Survey-Persisted-By': persistedBy,
      },
    })
  }

  return NextResponse.json(
    {
      generatedAt,
      count: records.length,
      persistedBy,
      records,
    },
    { status: 200 }
  )
}
