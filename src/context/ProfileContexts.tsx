// ─── src/context/ProfileContext.tsx ───────────────────────────────────────────

import {
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

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ProfileContextValue {

  profile: ProfileData;

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

// ── Context ───────────────────────────────────────────────────────────────────

const ProfileContext =
  createContext<ProfileContextValue | null>(
    null
  );

// ── Perfil vacío ──────────────────────────────────────────────────────────────

const EMPTY_PROFILE: ProfileData = {

  name: "",

  bio: "",

  photo: null,

  tags: [],

  socials: [],

  services: [],

  sessions: [],
};

// ── Provider ──────────────────────────────────────────────────────────────────

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

  // ── Cargar perfil ──────────────────────────────────────────────────────────

  const loadProfile = useCallback(
    async () => {

      if (!user) {
        setProfile(EMPTY_PROFILE);
        return;
      }

      const data =
        await profileService.getProfile();

      setProfile(data);
    },
    [user]
  );

  // ── Esperar autenticación Firebase ─────────────────────────────────────────

  useEffect(() => {

    if (!loading && user) {
      loadProfile();
    }

    if (!loading && !user) {
      setProfile(EMPTY_PROFILE);
    }

  }, [
    user,
    loading,
    loadProfile,
  ]);

  // ── Guardar perfil ─────────────────────────────────────────────────────────

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

  // ── Patch profile ──────────────────────────────────────────────────────────

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

  // ── Reset profile ──────────────────────────────────────────────────────────

  const resetProfile = useCallback(
    async () => {

      const def =
        await profileService.resetProfile();

      setProfile(def);
    },
    []
  );

  // ── Iniciales ──────────────────────────────────────────────────────────────

  const userInitials =
    profile.name
      ?.slice(0, 2)
      .toUpperCase() || "ZU";

  // ── Provider ───────────────────────────────────────────────────────────────

  return (
    <ProfileContext.Provider
      value={{

        profile,

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

// ── Hook ──────────────────────────────────────────────────────────────────────

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