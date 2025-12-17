import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block font-semibold text-text-primary">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors',
            'text-text-primary placeholder:text-text-muted',
            error
              ? 'border-error focus:ring-2 focus:ring-error/20'
              : 'border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        {helperText && !error && <p className="text-sm text-text-muted">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
