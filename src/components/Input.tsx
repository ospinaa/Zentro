import type { ChangeEvent, InputHTMLAttributes } from 'react'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onChange'> {
  id: string
  label: string
  error?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Input({
  id,
  label,
  error,
  className = '',
  ...rest
}: InputProps) {
  const inputClass = ['auth-input', error ? 'auth-input--error' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <input id={id} className={inputClass} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {error ? (
        <p id={`${id}-err`} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
