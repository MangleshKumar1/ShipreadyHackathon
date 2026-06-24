'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DecisionCard from '@/components/DecisionCard'

interface Theme {
  rank: number
  name: string
  opportunity_score: number
  sentiment: string
  impact: string
  effort: string
  is_quick_win: boolean
  evidence: { quote: string; count: number }[]
}

interface Decisions {
  build_now: { theme: string; reasoning: string; evidence_strength: string }
  plan_later: { theme: string; reason: string }[]
  quick_wins: { theme: string; reason: string }[]
  low_signal: { theme: string; reason: string }[]
}

interface AnalysisData {
  total_analyzed: number
  themes: Theme[]
  decisions: Decisions
}

export default function DecisionPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('shipready_analysis')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAnalysis(parsed)

        ;(window as any).pendo?.track('decision_viewed', {
          build_now_theme: parsed.decisions?.build_now?.theme || '',
          total_analyzed: parsed.total_analyzed || 0,
          plan_later_count: parsed.decisions?.plan_later?.length || 0,
          quick_wins_count: parsed.decisions?.quick_wins?.length || 0,
          low_signal_count: parsed.decisions?.low_signal?.length || 0,
        })
      } catch {
        // corrupt data — ignore
      }
    }
    const savedTheme = localStorage.getItem('shipready_selected_theme')
    if (savedTheme) {
      try {
        setSelectedTheme(JSON.parse(savedTheme))
      } catch {
        // corrupt data — ignore
      }
    }
  }, [])

  if (!analysis) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="text-sm text-gray-500">
            No analysis found.{' '}
            <Link href="/analyze" className="underline">
              Start here
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const { decisions, themes } = analysis

  // Determine the active build now theme name
  const buildNowThemeName = selectedTheme?.name || decisions.build_now.theme

  // Find reasoning and evidence strength for the active build now theme
  let reasoning = decisions.build_now.reasoning
  let evidenceStrength = decisions.build_now.evidence_strength

  if (selectedTheme && selectedTheme.name !== decisions.build_now.theme) {
    const planLaterItem = decisions.plan_later.find((item) => item.theme === selectedTheme.name)
    const quickWinItem = decisions.quick_wins.find((item) => item.theme === selectedTheme.name)
    const lowSignalItem = decisions.low_signal.find((item) => item.theme === selectedTheme.name)

    reasoning =
      planLaterItem?.reason ||
      quickWinItem?.reason ||
      lowSignalItem?.reason ||
      'Selected by user for immediate implementation.'

    const totalQuotesCount = selectedTheme.evidence?.reduce((sum, e) => sum + e.count, 0) || 0
    evidenceStrength = `${totalQuotesCount} user mentions in feedback`
  }

  // Filter other lists to avoid duplicates
  const planLaterList = decisions.plan_later.filter((item) => item.theme !== buildNowThemeName)
  const quickWinsList = decisions.quick_wins.filter((item) => item.theme !== buildNowThemeName)
  const lowSignalList = decisions.low_signal.filter((item) => item.theme !== buildNowThemeName)

  // Demote original build now theme to plan later if user selected a different theme
  if (buildNowThemeName !== decisions.build_now.theme) {
    const originalThemeFull = themes.find((t) => t.name === decisions.build_now.theme)
    const scoreText = originalThemeFull ? ` (Score: ${originalThemeFull.opportunity_score}/10)` : ''
    planLaterList.unshift({
      theme: decisions.build_now.theme,
      reason: `AI recommended Build Now${scoreText}, postponed by user choice.`,
    })
  }

  function handleGenerateSpec() {
    if (!analysis) return
    const { themes } = analysis
    // Find the full theme object (with evidence) for the active build now theme
    const fullTheme = themes.find((t) => t.name === buildNowThemeName) ?? {
      name: buildNowThemeName,
      rank: 1,
      opportunity_score: 9,
      sentiment: 'negative',
      impact: 'high',
      effort: 'low',
      is_quick_win: false,
      evidence: [],
    }
    localStorage.setItem('shipready_selected_theme', JSON.stringify(fullTheme))
    router.push('/spec')
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/insights" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back
          </Link>
          <span className="text-sm text-gray-400">Step 2 of 3</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendation</h1>
          <p className="text-sm text-gray-500">
            Based on {analysis.total_analyzed} signals, here&apos;s what to do:
          </p>
        </div>

        {/* Decision cards */}
        <div className="space-y-3">
          <DecisionCard
            type="build_now"
            theme={buildNowThemeName}
            reasoning={reasoning}
            evidenceStrength={evidenceStrength}
          />
          {planLaterList.map((item) => (
            <DecisionCard key={item.theme} type="plan_later" theme={item.theme} reason={item.reason} />
          ))}
          {quickWinsList.map((item) => (
            <DecisionCard key={item.theme} type="quick_win" theme={item.theme} reason={item.reason} />
          ))}
          {lowSignalList.map((item) => (
            <DecisionCard key={item.theme} type="low_signal" theme={item.theme} reason={item.reason} />
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleGenerateSpec}
        >
          Generate Spec for: {buildNowThemeName} →
        </Button>

      </div>
    </main>
  )
}

