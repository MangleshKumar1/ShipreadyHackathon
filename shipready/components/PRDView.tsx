import { Separator } from '@/components/ui/separator'

export interface UserStory {
  story: string
  evidence_quote: string
  evidence_count: number
}

export interface PRDData {
  title: string
  problem_statement: string
  target_user: string
  user_stories: UserStory[]
  success_metrics: string[]
  edge_cases: string[]
  risks: string[]
  acceptance_criteria: string[]
  sources_summary: string
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </h3>
  )
}

function BulletList({ items, prefix = '• ', className = 'text-gray-700' }: {
  items: string[]
  prefix?: string
  className?: string
}) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-2 text-sm ${className}`}>
          <span className="shrink-0 select-none">{prefix}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PRDView({ prd }: { prd: PRDData }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <SectionHeading>Problem Statement</SectionHeading>
        <p className="text-sm text-gray-700 leading-relaxed">{prd.problem_statement}</p>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <SectionHeading>Target User</SectionHeading>
        <p className="text-sm text-gray-700">{prd.target_user}</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <SectionHeading>User Stories</SectionHeading>
        {prd.user_stories.map((s, i) => (
          <div key={i} className="space-y-1.5">
            <p className="text-sm text-gray-800">{s.story}</p>
            <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500 border border-gray-100">
              📌 Customer said: <em>"{s.evidence_quote}"</em>
              <span className="ml-1 font-medium">({s.evidence_count} mentions)</span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-1.5">
        <SectionHeading>Success Metrics</SectionHeading>
        <BulletList items={prd.success_metrics} />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <SectionHeading>Edge Cases</SectionHeading>
        <BulletList items={prd.edge_cases} />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <SectionHeading>Risks</SectionHeading>
        <BulletList items={prd.risks} prefix="⚠ " className="text-amber-700" />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <SectionHeading>Acceptance Criteria</SectionHeading>
        <BulletList items={prd.acceptance_criteria} prefix="✓ " className="text-gray-700" />
      </div>

      <div className="rounded-md bg-gray-50 px-4 py-2.5 text-xs text-gray-400">
        Generated from: {prd.sources_summary}
      </div>
    </div>
  )
}
