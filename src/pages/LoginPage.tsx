import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layout/AuthLayout'
import { loginUser } from '../services/auth' // 👈 nuevo

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // 👈 manejo de error

  useEffect(() => {
    document.title = 'Sign in · Zentro'
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    try {
      await loginUser(email, password)
      navigate('/home', { replace: true })
    } catch (err) {
      console.error(err)
      setError('Invalid email or password')
    }
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

          {/* 👇 mostrar error */}
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

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