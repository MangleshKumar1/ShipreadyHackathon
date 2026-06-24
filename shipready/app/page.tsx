'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

let sessionTracked = false

const EXAMPLE_FEEDBACK = `The onboarding takes forever, I gave up twice
Mobile app crashes every time I switch projects
PLEASE add CSV export, asked this 3 times
My whole team uses mobile and its unusable
Why cant I export data? Basic functionality`

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (!sessionTracked) {
      sessionTracked = true
      ;(window as any).pendo?.track('session_started', {
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      })
    }
  }, [])

  function handleSeeExample() {
    localStorage.setItem('shipready_feedback', EXAMPLE_FEEDBACK)
    router.push('/analyze')
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl text-center space-y-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">ShipReady</span>
        </div>

        {/* Hero text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900">
            Turn customer feedback into<br />
            evidence-backed product decisions.
          </h1>
          <p className="text-lg text-gray-500">
            Not summaries. Not sentiment.<br />
            Actual decisions. With proof.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span className="font-medium text-gray-600">Paste feedback</span>
          <span>→</span>
          <span className="font-medium text-gray-600">Get decision</span>
          <span>→</span>
          <span className="font-medium text-gray-600">Ship</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-8"
            onClick={() => router.push('/analyze')}
          >
            Analyze My Feedback →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8"
            onClick={handleSeeExample}
          >
            See Example
          </Button>
        </div>

      </div>
    </main>
  )
}
