import type { ReactNode } from 'react'

export interface AuthCardProps {
  children: ReactNode
  className?: string
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return <div className={`auth-card ${className}`.trim()}>{children}</div>
}
