
import { supabase } from "./supabase";
import { auth } from "./firebase";

import type {
  ProfileData,
} from "../pages/ProfilePage";


const DEFAULT_PROFILE: ProfileData = {

  name: "",

  bio: "",

  photo: null,

  tags: [],

  socials: [],

  services: [],

  sessions: [],
};


export async function getProfile(): Promise<ProfileData> {

  const user = auth.currentUser;

  if (!user) {
    return DEFAULT_PROFILE;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("firebase_uid", user.uid)
    .single();


  if (error || !data) {

    await createProfile();

    return {
      ...DEFAULT_PROFILE,

      name: user.displayName || "",
    };
  }

  return {
    name: data.name || "",

    bio: data.bio || "",

    photo: data.photo || null,

    tags: data.tags || [],

    socials: data.socials || [],

    services: data.services || [],

    sessions: data.sessions || [],
  };
}


export async function createProfile() {

  const user = auth.currentUser;

  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .insert([
      {
        firebase_uid: user.uid,

        name: user.displayName || "",

        bio: "",

        photo: null,

        tags: [],

        socials: [],

        services: [],

        sessions: [],
      },
    ]);

  if (error) {
    console.error(
      "Error creando perfil:",
      error
    );
  }
}


export async function saveProfile(
  profile: ProfileData
): Promise<void> {

  const user = auth.currentUser;

  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      name: profile.name,

      bio: profile.bio,

      photo: profile.photo,

      tags: profile.tags,

      socials: profile.socials,

      services: profile.services,

      sessions: profile.sessions,
    })
    .eq("firebase_uid", user.uid);

  if (error) {
    console.error(
      "Error guardando perfil:",
      error
    );
  }
}


export async function updateProfile(
  fields: Partial<ProfileData>
): Promise<ProfileData> {

  const current =
    await getProfile();

  const updated = {
    ...current,
    ...fields,
  };

  await saveProfile(updated);

  return updated;
}


export async function resetProfile(): Promise<ProfileData> {

  await saveProfile(DEFAULT_PROFILE);

  return DEFAULT_PROFILE;
}