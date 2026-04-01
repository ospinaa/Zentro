import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layout/AuthLayout'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    document.title = 'Sign in · Zentro'
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Simulated sign-in until real auth (e.g. Firebase) is wired
    console.log('Login submit', { email, password })
    navigate('/home', { replace: true })
  }

  return (
    <AuthLayout>
      <AuthCard>
        <p className="auth-card__brand">ZENTRO</p>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to continue</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <Input
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
          <Button type="submit" variant="primary">
            Sign in
          </Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
