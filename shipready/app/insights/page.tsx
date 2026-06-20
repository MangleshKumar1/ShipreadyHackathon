'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeCard from '@/components/ThemeCard'

interface AnalysisData {
  total_analyzed: number
  executive_summary: string
  themes: {
    rank: number
    name: string
    opportunity_score: number
    sentiment: string
    impact: string
    effort: string
    is_quick_win: boolean
    evidence: { quote: string; count: number }[]
  }[]
  decisions: {
    build_now: { theme: string; reasoning: string; evidence_strength: string }
    plan_later: { theme: string; reason: string }[]
    quick_wins: { theme: string; reason: string }[]
    low_signal: { theme: string; reason: string }[]
  }
}

export default function InsightsPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('shipready_analysis')
    if (!saved) {
      router.replace('/analyze')
      return
    }
    try {
      setAnalysis(JSON.parse(saved))
    } catch {
      router.replace('/analyze')
      return
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    )
  }

  if (!analysis) return null

  const lowSignal = analysis.decisions?.low_signal ?? []

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/analyze" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back
          </Link>
          <span className="text-sm text-gray-400">Step 2 of 3</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Signal Analysis</h1>
          <p className="text-sm text-gray-500">
            Analyzed {analysis.total_analyzed} feedback items • Found{' '}
            {analysis.themes.length} themes
          </p>
        </div>

        {/* Executive summary */}
        <div className="rounded-lg bg-gray-100 px-4 py-3">
          <p className="text-sm text-gray-700">{analysis.executive_summary}</p>
        </div>

        {/* Theme cards */}
        <div className="space-y-4">
          {analysis.themes.map((theme) => (
            <ThemeCard key={theme.rank} theme={theme} />
          ))}
        </div>

        {/* Low signal */}
        {lowSignal.length > 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3">
            <p className="mb-2 text-sm font-semibold text-gray-500">
              ⚠ Low Signal — Don&apos;t build now:
            </p>
            <div className="flex flex-wrap gap-2">
              {lowSignal.map((item) => (
                <span
                  key={item.theme}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500"
                >
                  {item.theme}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
