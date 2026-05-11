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

  // ── NUEVO: estado de carga del perfil ──────────────────────────────────────

  const [profileLoading, setProfileLoading] =
    useState(true);

  // ── Cargar perfil ──────────────────────────────────────────────────────────

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

  // ── Esperar autenticación Firebase ─────────────────────────────────────────

  useEffect(() => {

    // Mientras Firebase aún está resolviendo la sesión,
    // mantener profileLoading en true para no mostrar datos vacíos.
    if (loading) {
      setProfileLoading(true);
      return;
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