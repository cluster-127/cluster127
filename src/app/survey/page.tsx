'use client'

import { motion, Variants } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react'

type YesNo = 'yes' | 'no' | ''
type IncidentFrequency = '0' | '1' | '2-3' | '4+' | ''
type RcaDuration = '<30m' | '30-120m' | '2-8h' | '>8h' | ''
type DecisionVersionChain = 'full' | 'partial' | 'none' | ''

type SurveyForm = {
  fullName: string
  workEmail: string
  company: string
  roleTitle: string
  segment: string
  incidentInLast30Days: YesNo
  workflowName: string
  impacts: string[]
  replayRcaDuration: RcaDuration
  decisionVersionChain: DecisionVersionChain
  costEstimate: string
  incidentFrequency: IncidentFrequency
  integrationOwnerAvailable: YesNo
  pilotOwner: string
  notes: string
  consent: boolean
  website: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  sourceUrl: string
}

const segments = ['Platform', 'SRE/DevOps', 'Support Ops', 'Other']
const impacts = [
  'User impact',
  'Operational delay',
  'Revenue/cost impact',
  'Deploy/release blockage',
]
const replayDurations: RcaDuration[] = ['<30m', '30-120m', '2-8h', '>8h']
const frequencyOptions: IncidentFrequency[] = ['0', '1', '2-3', '4+']
const versionChainOptions: DecisionVersionChain[] = ['full', 'partial', 'none']

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

const textInputClass =
  'w-full border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors'
const labelClass = 'text-sm uppercase tracking-[0.12em] text-white/70'

function initialForm(): SurveyForm {
  return {
    fullName: '',
    workEmail: '',
    company: '',
    roleTitle: '',
    segment: '',
    incidentInLast30Days: '',
    workflowName: '',
    impacts: [],
    replayRcaDuration: '',
    decisionVersionChain: '',
    costEstimate: '',
    incidentFrequency: '',
    integrationOwnerAvailable: '',
    pilotOwner: '',
    notes: '',
    consent: false,
    website: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    sourceUrl: '',
  }
}

function validate(form: SurveyForm): string[] {
  const errors: string[] = []

  if (!form.fullName.trim()) errors.push('Full name is required.')
  if (!form.workEmail.trim()) errors.push('Work email is required.')
  if (form.workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail)) {
    errors.push('Work email format is invalid.')
  }
  if (!form.company.trim()) errors.push('Company is required.')
  if (!form.segment.trim()) errors.push('Segment is required.')
  if (!form.incidentInLast30Days)
    errors.push('Please answer whether an incident occurred in the last 30 days.')
  if (!form.integrationOwnerAvailable)
    errors.push('Please specify owner availability in the next 2-4 weeks.')
  if (!form.consent) errors.push('You must agree to data processing for follow-up.')

  if (form.incidentInLast30Days === 'yes') {
    if (!form.workflowName.trim()) errors.push('Workflow name is required when an incident exists.')
    if (form.impacts.length === 0) errors.push('Select at least one incident impact.')
    if (!form.replayRcaDuration)
      errors.push('Replay/RCA duration is required when an incident exists.')
    if (!form.decisionVersionChain) errors.push('Decision version chain completeness is required.')
    if (!form.incidentFrequency)
      errors.push('Incident frequency is required when an incident exists.')
  }

  if (form.integrationOwnerAvailable === 'yes' && !form.pilotOwner.trim()) {
    errors.push('Pilot owner is required when owner availability is yes.')
  }

  return errors
}

export default function Survey() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState<SurveyForm>(initialForm)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({
    type: 'idle',
    message: '',
  })

  const utm = useMemo(
    () => ({
      utmSource: searchParams.get('utm_source') ?? '',
      utmMedium: searchParams.get('utm_medium') ?? '',
      utmCampaign: searchParams.get('utm_campaign') ?? '',
    }),
    [searchParams],
  )

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...utm,
      sourceUrl: typeof window === 'undefined' ? '' : window.location.href,
    }))
  }, [utm])

  function updateField<K extends keyof SurveyForm>(key: K, value: SurveyForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleImpact(value: string) {
    setForm((prev) => {
      const exists = prev.impacts.includes(value)
      const next = exists ? prev.impacts.filter((item) => item !== value) : [...prev.impacts, value]
      return { ...prev, impacts: next }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState({ type: 'idle', message: '' })

    const localErrors = validate(form)
    if (localErrors.length > 0) {
      setErrors(localErrors)
      return
    }

    setErrors([])
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const payload = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Submission failed.')
      }

      setSubmitState({
        type: 'success',
        message: payload.message ?? 'Thanks. Your response was recorded.',
      })
      setForm({
        ...initialForm(),
        ...utm,
        sourceUrl: typeof window === 'undefined' ? '' : window.location.href,
      })
    } catch (err) {
      setSubmitState({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unexpected error while submitting.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Suspense fallback={<>...</>}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 flex flex-col px-8 md:px-16 pt-32 pb-16">
        <motion.section variants={itemVariants} className="mb-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-8">
            Incident Discovery Survey
          </h1>

          <p className="text-white/60 text-lg leading-relaxed mb-4 max-w-3xl">
            This form is not for product opinions. We only capture measurable cause-and-effect from
            your latest automated-decision incident.
          </p>
          <p className="text-white/40 text-sm leading-relaxed max-w-3xl">
            Expected time: 5-7 minutes. If no incident happened in the last 30 days, keep answers
            short and submit anyway.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="border border-white/10 bg-white/2 p-6 md:p-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className={labelClass}>Full Name</span>
                <input
                  className={textInputClass}
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Work Email</span>
                <input
                  className={textInputClass}
                  type="email"
                  value={form.workEmail}
                  onChange={(e) => updateField('workEmail', e.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Company</span>
                <input
                  className={textInputClass}
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Role / Title</span>
                <input
                  className={textInputClass}
                  value={form.roleTitle}
                  onChange={(e) => updateField('roleTitle', e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className={labelClass}>Segment</p>
              <div className="grid gap-2 md:grid-cols-4">
                {segments.map((segment) => (
                  <label
                    key={segment}
                    className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                    <input
                      type="radio"
                      name="segment"
                      value={segment}
                      checked={form.segment === segment}
                      onChange={(e) => updateField('segment', e.target.value)}
                    />
                    {segment}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className={labelClass}>Any automated-decision incident in the last 30 days?</p>
              <div className="grid gap-2 md:grid-cols-2">
                {['yes', 'no'].map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                    <input
                      type="radio"
                      name="incident"
                      value={value}
                      checked={form.incidentInLast30Days === value}
                      onChange={(e) => updateField('incidentInLast30Days', e.target.value as YesNo)}
                    />
                    {value === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>

            {form.incidentInLast30Days === 'yes' && (
              <div className="space-y-8 border border-white/10 p-4 md:p-6">
                <label className="space-y-2 block">
                  <span className={labelClass}>Which workflow was affected?</span>
                  <input
                    className={textInputClass}
                    value={form.workflowName}
                    onChange={(e) => updateField('workflowName', e.target.value)}
                  />
                </label>

                <div className="space-y-3">
                  <p className={labelClass}>What was the impact?</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {impacts.map((impact) => (
                      <label
                        key={impact}
                        className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={form.impacts.includes(impact)}
                          onChange={() => toggleImpact(impact)}
                        />
                        {impact}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className={labelClass}>Replay + RCA duration</p>
                    <div className="space-y-2">
                      {replayDurations.map((duration) => (
                        <label
                          key={duration}
                          className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                          <input
                            type="radio"
                            name="replay-duration"
                            value={duration}
                            checked={form.replayRcaDuration === duration}
                            onChange={(e) =>
                              updateField('replayRcaDuration', e.target.value as RcaDuration)
                            }
                          />
                          {duration}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className={labelClass}>Decision version chain reconstruction</p>
                    <div className="space-y-2">
                      {versionChainOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80 capitalize">
                          <input
                            type="radio"
                            name="version-chain"
                            value={option}
                            checked={form.decisionVersionChain === option}
                            onChange={(e) =>
                              updateField(
                                'decisionVersionChain',
                                e.target.value as DecisionVersionChain,
                              )
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass}>Estimated cost per incident</span>
                    <input
                      className={textInputClass}
                      value={form.costEstimate}
                      onChange={(e) => updateField('costEstimate', e.target.value)}
                      placeholder="e.g. 6 engineer-hours + delayed release"
                    />
                  </label>
                  <div className="space-y-3">
                    <p className={labelClass}>How often per month?</p>
                    <div className="grid gap-2 grid-cols-2">
                      {frequencyOptions.map((frequency) => (
                        <label
                          key={frequency}
                          className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                          <input
                            type="radio"
                            name="frequency"
                            value={frequency}
                            checked={form.incidentFrequency === frequency}
                            onChange={(e) =>
                              updateField('incidentFrequency', e.target.value as IncidentFrequency)
                            }
                          />
                          {frequency}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className={labelClass}>Do you have an owner for a 2-4 week integration window?</p>
              <div className="grid gap-2 md:grid-cols-2">
                {['yes', 'no'].map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 border border-white/10 p-3 text-sm text-white/80">
                    <input
                      type="radio"
                      name="integration-owner"
                      value={value}
                      checked={form.integrationOwnerAvailable === value}
                      onChange={(e) =>
                        updateField('integrationOwnerAvailable', e.target.value as YesNo)
                      }
                    />
                    {value === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>

            {form.integrationOwnerAvailable === 'yes' && (
              <label className="space-y-2 block">
                <span className={labelClass}>Who would own the pilot?</span>
                <input
                  className={textInputClass}
                  value={form.pilotOwner}
                  onChange={(e) => updateField('pilotOwner', e.target.value)}
                  placeholder="Team or role name"
                />
              </label>
            )}

            <label className="space-y-2 block">
              <span className={labelClass}>Additional notes (optional)</span>
              <textarea
                className={`${textInputClass} min-h-35 resize-y`}
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </label>

            <input
              type="text"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField('consent', e.target.checked)}
                className="mt-1"
              />
              I allow Cluster 127 to process this data for incident follow-up and pilot
              qualification.
            </label>

            {errors.length > 0 && (
              <div className="border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
                <ul className="space-y-1">
                  {errors.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {submitState.type !== 'idle' && (
              <div
                className={`border p-4 text-sm ${
                  submitState.type === 'success'
                    ? 'border-emerald-400/30 bg-emerald-400/5 text-emerald-200'
                    : 'border-red-400/30 bg-red-400/5 text-red-200'
                }`}>
                {submitState.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.16em] text-white hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </form>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-white/5 max-w-4xl">
          <p className="text-white/50 text-sm">
            We use this evidence to qualify discovery and pilot readiness.
          </p>
        </motion.section>
      </motion.div>
    </Suspense>
  )
}
