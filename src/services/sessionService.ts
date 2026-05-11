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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo sesiones:", error);
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

    createdAt: new Date(s.created_at).getTime(),
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

  if (now < start) return "upcoming";

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
    throw new Error("Usuario no autenticado");
  }

  const session: Partial<CalendarSession> = {
    ...data,
    status: "upcoming",
  };

  const resolvedStatus =
    resolveStatus(session as CalendarSession);

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

        status: resolvedStatus,

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