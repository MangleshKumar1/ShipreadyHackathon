type DecisionType = 'build_now' | 'plan_later' | 'quick_win' | 'low_signal'

interface DecisionCardProps {
  type: DecisionType
  theme: string
  reasoning?: string
  evidenceStrength?: string
  reason?: string
}

const styles: Record<DecisionType, { icon: string; label: string; bg: string; ring: string; labelColor: string }> = {
  build_now: {
    icon: '✅',
    label: 'BUILD NOW',
    bg: 'bg-green-50',
    ring: 'ring-1 ring-green-300',
    labelColor: 'text-green-700',
  },
  plan_later: {
    icon: '⏳',
    label: 'PLAN LATER',
    bg: 'bg-yellow-50',
    ring: 'ring-1 ring-yellow-300',
    labelColor: 'text-yellow-700',
  },
  quick_win: {
    icon: '⚡',
    label: 'QUICK WIN THIS SPRINT',
    bg: 'bg-blue-50',
    ring: 'ring-1 ring-blue-300',
    labelColor: 'text-blue-700',
  },
  low_signal: {
    icon: '🔕',
    label: 'LOW SIGNAL',
    bg: 'bg-gray-100',
    ring: 'ring-1 ring-gray-300',
    labelColor: 'text-gray-500',
  },
}

export default function DecisionCard({ type, theme, reasoning, evidenceStrength, reason }: DecisionCardProps) {
  const s = styles[type]
  return (
    <div className={`rounded-xl p-5 space-y-2 ${s.bg} ${s.ring}`}>
      <div className="flex items-center gap-2">
        <span>{s.icon}</span>
        <span className={`text-[11px] font-bold tracking-widest uppercase ${s.labelColor}`}>
          {s.label}
        </span>
      </div>
      <p className="font-semibold text-gray-900">{theme}</p>
      {reasoning && <p className="text-sm text-gray-600">{reasoning}</p>}
      {evidenceStrength && (
        <div className="rounded bg-white/70 px-2.5 py-1.5 text-xs text-gray-500">
          📌 {evidenceStrength}
        </div>
      )}
      {reason && <p className="text-sm text-gray-500">{reason}</p>}
    </div>
  )
}
