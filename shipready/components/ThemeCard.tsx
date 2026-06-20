'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export interface Evidence {
  quote: string
  count: number
}

export interface Theme {
  rank: number
  name: string
  opportunity_score: number
  sentiment: string
  impact: string
  effort: string
  is_quick_win: boolean
  evidence: Evidence[]
}

export default function ThemeCard({ theme }: { theme: Theme }) {
  const router = useRouter()

  function handleGenerateSpec() {
    localStorage.setItem('shipready_selected_theme', JSON.stringify(theme))
    router.push('/decision')
  }

  const isTop = theme.rank === 1

  return (
    <Card className={isTop ? 'ring-2 ring-black' : ''}>
      <CardContent className="space-y-4">
        {/* Rank + name + score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 w-6">#{theme.rank}</span>
            <h3 className="font-semibold text-gray-900">{theme.name}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold text-gray-900">{theme.opportunity_score}</span>
            <span className="text-xs text-gray-400 self-end mb-0.5">/10</span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={theme.opportunity_score * 10} />

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {theme.is_quick_win && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              ⚡ Quick Win
            </span>
          )}
          {isTop && !theme.is_quick_win && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
              🔥 High Opportunity
            </span>
          )}
          <Badge variant="outline" className="text-xs capitalize">Impact: {theme.impact}</Badge>
          <Badge variant="outline" className="text-xs capitalize">Effort: {theme.effort}</Badge>
          <Badge variant="outline" className="text-xs capitalize">{theme.sentiment}</Badge>
        </div>

        {/* Evidence */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            📌 Evidence
          </p>
          {theme.evidence.map((e, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
              <p className="text-sm italic text-gray-600">"{e.quote}"</p>
              <span className="shrink-0 text-xs text-gray-400">{e.count} users</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleGenerateSpec}
        >
          Generate Spec →
        </Button>
      </CardContent>
    </Card>
  )
}
