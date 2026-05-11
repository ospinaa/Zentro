import { supabase } from "./supabase";
import { auth } from "./firebase";

export interface AcademicEvent {
  id: string;

  firebase_uid: string;

  title: string;

  description: string;

  eventTime: string;

  externalLink: string;

  createdAt: number;
}

// ─────────────────────────────────────────────
// Obtener eventos
// ─────────────────────────────────────────────

export async function getAcademicEvents(): Promise<AcademicEvent[]> {

  const { data, error } = await supabase
    .from("academic_events")
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

// ─────────────────────────────────────────────
// Crear evento
// ─────────────────────────────────────────────

export async function addAcademicEvent(
  data: Omit<
    AcademicEvent,
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
    .from("academic_events")
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

  return await getAcademicEvents();
}

// ─────────────────────────────────────────────
// Editar evento
// ─────────────────────────────────────────────

export async function updateAcademicEvent(
  id: string,
  fields: Partial<AcademicEvent>
) {

  const { error } = await supabase
    .from("academic_events")
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

  return await getAcademicEvents();
}

// ─────────────────────────────────────────────
// Eliminar evento
// ─────────────────────────────────────────────

export async function deleteAcademicEvent(
  id: string
) {

  const { error } = await supabase
    .from("academic_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  return await getAcademicEvents();
}