'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DecisionCard from '@/components/DecisionCard'

interface Decisions {
  build_now: { theme: string; reasoning: string; evidence_strength: string }
  plan_later: { theme: string; reason: string }[]
  quick_wins: { theme: string; reason: string }[]
  low_signal: { theme: string; reason: string }[]
}

interface AnalysisData {
  total_analyzed: number
  decisions: Decisions
}

export default function DecisionPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('shipready_analysis')
    if (saved) {
      try {
        setAnalysis(JSON.parse(saved))
      } catch {
        // corrupt data — ignore
      }
    }
  }, [])

  function handleGenerateSpec() {
    if (!analysis) return
    localStorage.setItem('shipready_build_now', JSON.stringify(analysis.decisions.build_now))
    router.push('/spec')
  }

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

  const { decisions } = analysis

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
            theme={decisions.build_now.theme}
            reasoning={decisions.build_now.reasoning}
            evidenceStrength={decisions.build_now.evidence_strength}
          />
          {decisions.plan_later.map((item) => (
            <DecisionCard key={item.theme} type="plan_later" theme={item.theme} reason={item.reason} />
          ))}
          {decisions.quick_wins.map((item) => (
            <DecisionCard key={item.theme} type="quick_win" theme={item.theme} reason={item.reason} />
          ))}
          {decisions.low_signal.map((item) => (
            <DecisionCard key={item.theme} type="low_signal" theme={item.theme} reason={item.reason} />
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleGenerateSpec}
        >
          Generate Spec for: {decisions.build_now.theme} →
        </Button>

      </div>
    </main>
  )
}
