// ─── src/services/sessionService.ts ───────────────────────────────────────────

import { supabase } from "./supabase";
import { auth } from "./firebase";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SessionStatus =
  | "upcoming"
  | "ongoing"
  | "done"
  | "cancelled";

export interface CalendarSession {
  id: string;

  firebase_uid?: string;

  title: string;
  description: string;

  date: string;

  startTime: string;
  endTime: string;

  status: SessionStatus;

  tags: string[];

  location: string;

  createdAt: number;
}

// ── Obtener sesiones ──────────────────────────────────────────────────────────

export async function getSessions(): Promise<CalendarSession[]> {

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {

    console.error(
      "Error obteniendo sesiones:",
      error
    );

    return [];
  }

  return data.map((s) => ({
    id: s.id,

    firebase_uid: s.firebase_uid,

    title: s.title,
    description: s.description,

    date: s.date,

    startTime: s.start_time,
    endTime: s.end_time,

    status: s.status,

    tags: s.tags || [],

    location: s.location,

    createdAt: new Date(
      s.created_at
    ).getTime(),
  }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function resolveStatus(
  session: CalendarSession
): SessionStatus {

  if (session.status === "cancelled") {
    return "cancelled";
  }

  const now = new Date();

  const start = new Date(
    `${session.date}T${session.startTime}`
  );

  const end = new Date(
    `${session.date}T${session.endTime}`
  );

  if (now < start) {
    return "upcoming";
  }

  if (now >= start && now <= end) {
    return "ongoing";
  }

  return "done";
}

// ── Crear sesión ──────────────────────────────────────────────────────────────

export async function addSession(
  data: Omit<
    CalendarSession,
    "id" | "status" | "createdAt"
  >
): Promise<CalendarSession[]> {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const tempSession: CalendarSession = {
    ...data,
    id: "",
    firebase_uid: user.uid,
    status: "upcoming",
    createdAt: Date.now(),
  };

  const status =
    resolveStatus(tempSession);

  const { error } = await supabase
    .from("sessions")
    .insert([
      {
        firebase_uid: user.uid,

        title: data.title,
        description: data.description,

        date: data.date,

        start_time: data.startTime,
        end_time: data.endTime,

        status,

        tags: data.tags,

        location: data.location,
      },
    ]);

  if (error) {

    console.error(
      "Error creando sesión:",
      error
    );
  }

  return await getSessions();
}

// ── Editar sesión ─────────────────────────────────────────────────────────────

export async function updateSession(
  id: string,
  fields: Partial<
    Omit<
      CalendarSession,
      "id" | "createdAt"
    >
  >
): Promise<CalendarSession[]> {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const updateData: any = {};

  if (fields.title !== undefined) {
    updateData.title = fields.title;
  }

  if (fields.description !== undefined) {
    updateData.description =
      fields.description;
  }

  if (fields.date !== undefined) {
    updateData.date = fields.date;
  }

  if (fields.startTime !== undefined) {
    updateData.start_time =
      fields.startTime;
  }

  if (fields.endTime !== undefined) {
    updateData.end_time =
      fields.endTime;
  }

  if (fields.status !== undefined) {
    updateData.status =
      fields.status;
  }

  if (fields.tags !== undefined) {
    updateData.tags = fields.tags;
  }

  if (fields.location !== undefined) {
    updateData.location =
      fields.location;
  }

  const { error } = await supabase
    .from("sessions")
    .update(updateData)
    .eq("id", id)
    .eq("firebase_uid", user.uid);

  if (error) {

    console.error(
      "Error editando sesión:",
      error
    );
  }

  return await getSessions();
}

// ── Eliminar sesión ───────────────────────────────────────────────────────────

export async function deleteSession(
  id: string
): Promise<CalendarSession[]> {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .eq("firebase_uid", user.uid);

  if (error) {

    console.error(
      "Error eliminando sesión:",
      error
    );
  }

  return await getSessions();
}

// ── Cancelar sesión ───────────────────────────────────────────────────────────

export async function cancelSession(
  id: string
): Promise<CalendarSession[]> {

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuario no autenticado"
    );
  }

  const { error } = await supabase
    .from("sessions")
    .update({
      status: "cancelled",
    })
    .eq("id", id)
    .eq("firebase_uid", user.uid);

  if (error) {

    console.error(
      "Error cancelando sesión:",
      error
    );
  }

  return await getSessions();
}

// ── Consultas ─────────────────────────────────────────────────────────────────

export function getSessionsByDay(
  sessions: CalendarSession[],
  date: string
): CalendarSession[] {

  return sessions.filter(
    (s) => s.date === date
  );
}

export function getSessionsByMonth(
  sessions: CalendarSession[],
  yearMonth: string
): CalendarSession[] {

  return sessions.filter((s) =>
    s.date.startsWith(yearMonth)
  );
}

export function getDaysWithSessions(
  sessions: CalendarSession[],
  yearMonth: string
): Set<string> {

  return new Set(
    getSessionsByMonth(
      sessions,
      yearMonth
    ).map((s) => s.date)
  );
}

export function getSessionStats(
  sessions: CalendarSession[]
) {

  return {
    total: sessions.length,

    upcoming: sessions.filter(
      (s) => s.status === "upcoming"
    ).length,

    ongoing: sessions.filter(
      (s) => s.status === "ongoing"
    ).length,

    done: sessions.filter(
      (s) => s.status === "done"
    ).length,

    cancelled: sessions.filter(
      (s) => s.status === "cancelled"
    ).length,
  };
}