import type { FormEvent } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { TextArea } from './TextArea'
import type { ProfileFieldErrors, UserProfile } from '../types/profile'

export interface ProfileFormProps {
  profile: UserProfile
  errors: ProfileFieldErrors
  successMessage: string
  onFieldChange: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function ProfileForm({
  profile,
  errors,
  successMessage,
  onFieldChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  return (
    <section className="profile-form-section" aria-labelledby="profile-form-heading">
      <div className="profile-form-card">
        <h2 id="profile-form-heading" className="profile-form-card__title">
          Edit Profile
        </h2>

        {successMessage ? (
          <p className="profile-form-card__success" role="status">
            {successMessage}
          </p>
        ) : null}

        <form className="profile-form" onSubmit={onSubmit} noValidate>
          <Input
            id="profile-name"
            name="name"
            type="text"
            label="Name"
            autoComplete="name"
            value={profile.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            error={errors.name}
          />
          <Input
            id="profile-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={profile.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            error={errors.email}
          />
          <TextArea
            id="profile-bio"
            name="bio"
            label="Bio"
            rows={4}
            placeholder="Tell others about yourself"
            value={profile.bio}
            onChange={(e) => onFieldChange('bio', e.target.value)}
            error={errors.bio}
          />
          <Input
            id="profile-skills"
            name="skills"
            type="text"
            label="Skills"
            placeholder="e.g. React, Math"
            value={profile.skills}
            onChange={(e) => onFieldChange('skills', e.target.value)}
            error={errors.skills}
          />
          <Input
            id="profile-interests"
            name="interests"
            type="text"
            label="Interests (optional)"
            placeholder="e.g. Football, Gym"
            value={profile.interests}
            onChange={(e) => onFieldChange('interests', e.target.value)}
            error={errors.interests}
          />

          <div className="profile-form__actions">
            <Button type="button" variant="secondary" fullWidth={false} onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth={false}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
