'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function AnalyzePage() {
  const router = useRouter()
  const [feedback, setFeedback] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('shipready_feedback')
    if (saved) {
      setFeedback(saved)
    }
  }, [])

  async function handleAnalyze() {
    if (!feedback.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, context }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      localStorage.setItem('shipready_input', JSON.stringify({ feedback, context }))
      localStorage.setItem('shipready_context', context.trim())
      localStorage.setItem('shipready_analysis', JSON.stringify(data))
      router.push('/insights')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back
          </Link>
          <span className="text-sm text-gray-400">Step 1 of 3</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Paste your customer feedback</h1>
          <p className="text-sm text-gray-500">The messier the better — we'll find the signal.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Textarea */}
        <div className="space-y-2">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Paste anything: G2 reviews, Slack messages, support tickets, interview notes, NPS responses..."
            className="min-h-[200px] resize-none bg-white text-sm"
            disabled={loading}
          />
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">What&apos;s your product? (optional)</Label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. B2B SaaS for HR teams, 50–200 employees"
            disabled={loading}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleAnalyze}
          disabled={loading || !feedback.trim()}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing your feedback...
            </span>
          ) : (
            'Analyze Feedback →'
          )}
        </Button>

      </div>
    </main>
  )
}
