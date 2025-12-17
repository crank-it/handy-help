export interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepName: string
}

export function ProgressBar({ currentStep, totalSteps, stepName }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-brand-primary">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-text-muted">{stepName}</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
