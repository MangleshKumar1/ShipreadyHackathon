'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import PRDView, { type PRDData } from '@/components/PRDView'

function prdToPlainText(prd: PRDData): string {
  return [
    `PRD: ${prd.title}`,
    '',
    'PROBLEM STATEMENT',
    prd.problem_statement,
    '',
    'TARGET USER',
    prd.target_user,
    '',
    'USER STORIES',
    ...prd.user_stories.map(
      (s, i) =>
        `${i + 1}. ${s.story}\n   Evidence: "${s.evidence_quote}" (${s.evidence_count} mentions)`
    ),
    '',
    'SUCCESS METRICS',
    ...prd.success_metrics.map((m) => `• ${m}`),
    '',
    'EDGE CASES',
    ...prd.edge_cases.map((e) => `• ${e}`),
    '',
    'RISKS',
    ...prd.risks.map((r) => `⚠ ${r}`),
    '',
    'ACCEPTANCE CRITERIA',
    ...prd.acceptance_criteria.map((a) => `✓ ${a}`),
    '',
    `Generated from: ${prd.sources_summary}`,
  ].join('\n')
}

export default function SpecPage() {
  const [prd, setPrd] = useState<PRDData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      // Always clear cached PRD — generate fresh for whichever theme was selected
      localStorage.removeItem('shipready_prd')

      const rawTheme = localStorage.getItem('shipready_selected_theme')
      if (!rawTheme) {
        setError('No theme selected. Go back and pick one.')
        setLoading(false)
        return
      }

      let theme: unknown
      try {
        theme = JSON.parse(rawTheme)
      } catch {
        setError('Invalid theme data. Go back and try again.')
        setLoading(false)
        return
      }

      const context = localStorage.getItem('shipready_context') || ''

      try {
        const res = await fetch('/api/prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme, context }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error((body as { error?: string }).error || `Server error ${res.status}`)
        }
        const data: PRDData = await res.json()
        setPrd(data)

        ;(window as any).pendo?.track('prd_generated', {
          theme: data.title || '',
          stories_count: data.user_stories?.length || 0,
          metrics_count: data.success_metrics?.length || 0,
          risks_count: data.risks?.length || 0,
          acceptance_criteria_count: data.acceptance_criteria?.length || 0,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'PRD generation failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function handleCopy() {
    if (!prd) return
    navigator.clipboard.writeText(prdToPlainText(prd))

    ;(window as any).pendo?.track('prd_exported', {
      format: 'text',
      theme: prd.title || '',
      stories_count: prd.user_stories?.length || 0,
    })

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
          <p className="text-gray-600 font-medium">Writing your product spec...</p>
          <p className="text-gray-400 text-sm">This takes about 10 seconds</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem('shipready_prd')
              window.location.reload()
            }}
            className="text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!prd) return null

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/decision" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back
          </Link>
          <span className="text-sm text-gray-400">Step 3 of 3</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Product Spec
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{prd.title}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 mt-1"
          >
            {copied ? '✓ Copied!' : 'Copy PRD'}
          </Button>
        </div>

        {/* PRD content */}
        <Card>
          <CardContent className="py-2">
            <PRDView prd={prd} />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
