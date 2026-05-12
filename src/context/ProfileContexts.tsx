
import {
<<<<<<< HEAD
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
=======
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  ProfileData,
} from "../pages/ProfilePage";

import * as profileService from "../services/profileService";

import { useAuth } from "./AuthContext";


interface ProfileContextValue {

  profile: ProfileData;

  profileLoading: boolean;

  saveProfile: (
    data: ProfileData
  ) => Promise<void>;

  patchProfile: (
    fields: Partial<ProfileData>
  ) => Promise<void>;

  resetProfile: () => Promise<void>;

  userInitials: string;

  refreshProfile: () => Promise<void>;
}


const ProfileContext =
  createContext<ProfileContextValue | null>(
    null
  );


const EMPTY_PROFILE: ProfileData = {

  name: "",

  bio: "",

  photo: null,

  tags: [],

  socials: [],

  services: [],

  sessions: [],
};


export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {

  const { user, loading } =
    useAuth();

  const [profile, setProfile] =
    useState<ProfileData>(
      EMPTY_PROFILE
    );


  const [profileLoading, setProfileLoading] =
    useState(true);


  const loadProfile = useCallback(
    async () => {

      if (!user) {
        setProfile(EMPTY_PROFILE);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const data =
          await profileService.getProfile();

        setProfile(data);
      } finally {
        setProfileLoading(false);
      }
    },
    [user]
  );


  useEffect(() => {

    
    if (loading) {
      setProfileLoading(true);
      return;
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
    }

    if (!loading && user) {
      loadProfile();
    }

    if (!loading && !user) {
      setProfile(EMPTY_PROFILE);
      setProfileLoading(false);
    }

  }, [
    user,
    loading,
    loadProfile,
  ]);


  const saveProfile = useCallback(
    async (
      data: ProfileData
    ) => {

      await profileService.saveProfile(
        data
      );

      setProfile(data);
    },
    []
  );


  const patchProfile = useCallback(
    async (
      fields: Partial<ProfileData>
    ) => {

      const updated =
        await profileService.updateProfile(
          fields
        );

      setProfile(updated);
    },
    []
  );


  const resetProfile = useCallback(
    async () => {

      const def =
        await profileService.resetProfile();

      setProfile(def);
    },
    []
  );


  const userInitials =
    profile.name
      ?.slice(0, 2)
      .toUpperCase() || "ZU";


  return (
    <ProfileContext.Provider
      value={{

        profile,

        profileLoading,

        saveProfile,

        patchProfile,

        resetProfile,

        userInitials,

        refreshProfile:
          loadProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}


export function useProfile(): ProfileContextValue {

  const ctx =
    useContext(ProfileContext);

  if (!ctx) {
    throw new Error(
      "useProfile debe usarse dentro de <ProfileProvider>"
    );
  }

  return ctx;
}