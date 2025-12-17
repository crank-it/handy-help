import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface SelectionCardProps {
  icon: ReactNode
  title: string
  description: string
  details?: string
  selected: boolean
  onClick: () => void
}

export function SelectionCard({
  icon,
  title,
  description,
  details,
  selected,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full p-6 rounded-xl border-2 text-left transition-all',
        selected
          ? 'border-brand-primary bg-success/10 shadow-lg'
          : 'border-border hover:border-brand-secondary hover:shadow-md bg-white'
      )}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center text-white">
          ✓
        </div>
      )}
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-xl text-brand-primary mb-1">{title}</h3>
      <p className="text-text-secondary text-sm mb-2">{description}</p>
      {details && <p className="text-text-muted text-xs">{details}</p>}
    </button>
  )
}
