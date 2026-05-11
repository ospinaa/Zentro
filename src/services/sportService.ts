import { supabase } from "./supabase";
import { auth } from "./firebase";

export interface SportsEvent {
  id: string;

  firebase_uid: string;

  title: string;

  description: string;

  eventTime: string;

  externalLink: string;

  createdAt: number;
}

export async function getSportsEvents(): Promise<SportsEvent[]> {

  const { data, error } = await supabase
    .from("sports_events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((e) => ({
    id: e.id,

    firebase_uid: e.firebase_uid,

    title: e.title,

    description: e.description,

    eventTime: e.event_time,

    externalLink: e.external_link,

    createdAt: new Date(
      e.created_at
    ).getTime(),
  }));
}

export async function addSportsEvent(
  data: Omit<
    SportsEvent,
    "id" |
    "firebase_uid" |
    "createdAt"
  >
) {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const { error } = await supabase
    .from("sports_events")
    .insert([
      {
        firebase_uid: user.uid,

        title: data.title,

        description: data.description,

        event_time: data.eventTime,

        external_link:
          data.externalLink,
      },
    ]);

  if (error) {
    console.error(error);
  }

  return await getSportsEvents();
}

export async function updateSportsEvent(
  id: string,
  fields: Partial<SportsEvent>
) {

  const { error } = await supabase
    .from("sports_events")
    .update({
      title: fields.title,

      description:
        fields.description,

      event_time:
        fields.eventTime,

      external_link:
        fields.externalLink,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  return await getSportsEvents();
}

export async function deleteSportsEvent(
  id: string
) {

  const { error } = await supabase
    .from("sports_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  return await getSportsEvents();
}