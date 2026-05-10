// ─── src/context/ProfileContext.tsx ───────────────────────────────────────────
// Context global del perfil de usuario.
// Persiste automáticamente en localStorage y expone helpers tipados.

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
  } from 'react'
  import type { ProfileData } from '../pages/ProfilePage'
  import * as profileService from '../services/profileService'
  
  // ── Tipos ─────────────────────────────────────────────────────────────────────
  
  interface ProfileContextValue {
    profile: ProfileData
  
    /** Reemplaza el perfil completo (viene del modal de edición). */
    saveProfile: (data: ProfileData) => void
  
    /** Actualiza solo algunos campos del perfil. */
    patchProfile: (fields: Partial<ProfileData>) => void
  
    /** Restablece el perfil al estado inicial. */
    resetProfile: () => void
  
    /** Iniciales para la navbar y el avatar. */
    userInitials: string
  }
  
  // ── Creación del context ──────────────────────────────────────────────────────
  
  const ProfileContext = createContext<ProfileContextValue | null>(null)
  
  // ── Provider ──────────────────────────────────────────────────────────────────
  
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
  
  // ── Hook ──────────────────────────────────────────────────────────────────────
  
  /**
   * useProfile — hook para consumir el ProfileContext.
   * Lanza error si se usa fuera del provider.
   */
  export function useProfile(): ProfileContextValue {
    const ctx = useContext(ProfileContext)
    if (!ctx) {
      throw new Error('useProfile debe usarse dentro de <ProfileProvider>')
    }
    return ctx
  }