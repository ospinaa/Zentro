import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__inner">{children}</div>
    </div>
  )
}
