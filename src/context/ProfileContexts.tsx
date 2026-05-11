
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
  } from 'react'
  import type { ProfileData } from '../pages/ProfilePage'
  import * as profileService from '../services/profileService'
  

  
  interface ProfileContextValue {
    profile: ProfileData
  

    saveProfile: (data: ProfileData) => void
  

    patchProfile: (fields: Partial<ProfileData>) => void
  
   
    resetProfile: () => void
  
  
    userInitials: string
  }
  

  
  const ProfileContext = createContext<ProfileContextValue | null>(null)
  

  
  export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<ProfileData>(() =>
        profileService.getProfile()
    )
  
    const saveProfile = useCallback((data: ProfileData) => {
      profileService.saveProfile(data)
      setProfile(data)
    }, [])
  
    const patchProfile = useCallback((fields: Partial<ProfileData>) => {
      const updated = profileService.updateProfile(fields)
      setProfile(updated)
    }, [])
  
    const resetProfile = useCallback(() => {
      const def = profileService.resetProfile()
      setProfile(def)
    }, [])
  
    const userInitials = profile.name.slice(0, 2).toUpperCase()
  
    return (
      <ProfileContext.Provider
        value={{ profile, saveProfile, patchProfile, resetProfile, userInitials }}
      >
        {children}
      </ProfileContext.Provider>
    )
  }
  

  export function useProfile(): ProfileContextValue {
    const ctx = useContext(ProfileContext)
    if (!ctx) {
      throw new Error('useProfile debe usarse dentro de <ProfileProvider>')
    }
    return ctx
  }