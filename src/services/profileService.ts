// ─── src/services/profileService.ts ───────────────────────────────────────────

import type { ProfileData } from '../pages/ProfilePage'

const STORAGE_KEY = 'zentro_profile'

const DEFAULT_PROFILE: ProfileData = {
  name: 'Tu Nombre',
  bio: 'Escribe algo sobre ti...',
  photo: null,
  tags: ['DMI', 'COM'],
  socials: [],
  services: [],
  sessions: [],
}

export function getProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProfileData) : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveProfile(profile: ProfileData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function updateProfile(fields: Partial<ProfileData>): ProfileData {
  const current = getProfile()
  const updated = { ...current, ...fields }
  saveProfile(updated)
  return updated
}

export function resetProfile(): ProfileData {
  saveProfile(DEFAULT_PROFILE)
  return DEFAULT_PROFILE
}