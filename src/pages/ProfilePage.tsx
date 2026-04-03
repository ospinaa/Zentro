import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileCard } from '../components/ProfileCard'
import { ProfileForm } from '../components/ProfileForm'
import { MOCK_USER_PROFILE } from '../data/mockProfile'
import { DashboardLayout } from '../layout/DashboardLayout'
import type { ProfileFieldErrors, UserProfile } from '../types/profile'
import { getInitials } from '../utils/initials'

function validateProfile(profile: UserProfile): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {}
  if (!profile.name.trim()) {
    errors.name = 'Name is required'
  }
  if (!profile.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
    errors.email = 'Enter a valid email'
  }
  return errors
}

export function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE)
  const [errors, setErrors] = useState<ProfileFieldErrors>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    document.title = 'Profile · Zentro'
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timer = window.setTimeout(() => setSuccessMessage(''), 3500)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  function handleFieldChange<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (successMessage) setSuccessMessage('')
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validateProfile(profile)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSuccessMessage('Profile updated successfully.')
  }

  function handleCancel() {
    navigate('/home')
  }

  const initials = getInitials(profile.name)

  return (
    <DashboardLayout userInitials={initials}>
      <div className="profile-layout">
        <ProfileCard
          profile={profile}
          initials={initials}
          onEditAvatar={() => {
            /* UI only — wire file upload later */
          }}
        />
        <ProfileForm
          profile={profile}
          errors={errors}
          successMessage={successMessage}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  )
}
