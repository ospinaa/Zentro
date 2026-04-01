import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'auth-btn',
    variant === 'primary' ? 'auth-btn--primary' : 'auth-btn--secondary',
    fullWidth ? 'auth-btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
