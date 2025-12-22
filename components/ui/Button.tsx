import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-primary hover:bg-brand-dark text-text-on-brand',
      secondary: 'bg-white border-2 border-brand-primary text-brand-primary hover:bg-bg-muted',
      ghost: 'text-brand-primary hover:bg-brand-primary/10',
      success: 'bg-success hover:bg-success/90 text-white',
      outline: 'bg-white border border-border text-text-primary hover:bg-bg-muted',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold rounded-lg transition-all',
          variants[variant],
          sizes[size],
          (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <span className="inline-block animate-spin mr-2">⏳</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
