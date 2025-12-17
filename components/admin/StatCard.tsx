import { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: 'primary' | 'secondary' | 'accent' | 'success'
}

export function StatCard({ label, value, icon, color = 'primary' }: StatCardProps) {
  const colors = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    secondary: 'bg-brand-secondary/10 text-brand-secondary',
    accent: 'bg-brand-accent/10 text-brand-accent',
    success: 'bg-success/10 text-success',
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="font-mono text-3xl font-bold text-brand-primary mb-1">
        {value}
      </div>
      <div className="text-sm text-text-muted">
        {label}
      </div>
    </Card>
  )
}
