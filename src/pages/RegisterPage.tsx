import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layout/AuthLayout'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [confirmError, setConfirmError] = useState('')

  useEffect(() => {
    document.title = 'Create account · Zentro'
  }, [])

  function updateField<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'confirmPassword' || key === 'password') {
      setConfirmError('')
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setConfirmError('Passwords do not match')
      return
    }
    setConfirmError('')
    console.log('Register submit', {
      name: form.name,
      email: form.email,
      password: form.password,
    })
  }

  return (
    <AuthLayout>
      <AuthCard>
        <p className="auth-card__brand">ZENTRO</p>
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Get started in a few seconds</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="register-name"
            name="name"
            type="text"
            label="Name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={form.name}
            onChange={(ev) => updateField('name', ev.target.value)}
            required
          />
          <Input
            id="register-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@company.com"
            autoComplete="email"
            value={form.email}
            onChange={(ev) => updateField('email', ev.target.value)}
            required
          />
          <Input
            id="register-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password}
            onChange={(ev) => updateField('password', ev.target.value)}
            required
          />
          <Input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(ev) => updateField('confirmPassword', ev.target.value)}
            error={confirmError}
            required
          />
          <Button type="submit" variant="primary">
            Sign up
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
