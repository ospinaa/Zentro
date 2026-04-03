export interface UserProfile {
  name: string
  email: string
  bio: string
  skills: string
  interests: string
}

export type ProfileFieldErrors = Partial<Record<keyof UserProfile, string>>
