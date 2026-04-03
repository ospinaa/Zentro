import type { ChangeEvent, TextareaHTMLAttributes } from 'react'

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'onChange'> {
  id: string
  label: string
  error?: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextArea({
  id,
  label,
  error,
  className = '',
  ...rest
}: TextAreaProps) {
  const areaClass = ['auth-input', error ? 'auth-input--error' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <textarea
        id={id}
        className={areaClass}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${id}-err`} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
