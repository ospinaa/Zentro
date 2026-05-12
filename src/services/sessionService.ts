<<<<<<< HEAD
export type SessionStatus =
  | 'upcoming'
  | 'ongoing'
  | 'done'
  | 'cancelled'

export interface CalendarSession {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: SessionStatus
  tags: string[]
  location: string
  createdAt: number
=======

import { supabase } from "./supabase";
import { auth } from "./firebase";


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
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
}


<<<<<<< HEAD
export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function resolveStatus(
  session: CalendarSession
): SessionStatus {
  if (session.status === 'cancelled') {
    return 'cancelled'
  }

  const now = new Date()

  const start = new Date(
    `${session.date}T${session.startTime}`
  )

  const end = new Date(
    `${session.date}T${session.endTime}`
  )

  if (now < start) return 'upcoming'

  if (now >= start && now <= end) {
    return 'ongoing'
  }

  return 'done'
}

export function getSessions(): CalendarSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw
      ? (JSON.parse(raw) as CalendarSession[])
      : []
  } catch {
    return []
=======
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
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
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

<<<<<<< HEAD
function persist(
  sessions: CalendarSession[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sessions)
  )
}

export function addSession(
  data: Omit<
    CalendarSession,
    'id' | 'status' | 'createdAt'
  >
): CalendarSession[] {
  const session: CalendarSession = {
=======

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
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
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

<<<<<<< HEAD
  session.status = resolveStatus(session)

  const sessions = [
    ...getSessions(),
    session
  ]

  persist(sessions)

  return sessions
=======
  return await getSessions();
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
}


export async function updateSession(
  id: string,
  fields: Partial<
<<<<<<< HEAD
    Omit<CalendarSession, 'id' | 'createdAt'>
  >
): CalendarSession[] {
  const sessions = getSessions().map((s) => {
    if (s.id !== id) return s

    const updated = {
      ...s,
      ...fields
    }

    if (fields.status !== 'cancelled') {
      updated.status = resolveStatus(updated)
    }

    return updated
  })

  persist(sessions)

  return sessions
}

export function deleteSession(
  id: string
): CalendarSession[] {
  const sessions = getSessions().filter(
    (s) => s.id !== id
  )

  persist(sessions)

  return sessions
}

export function cancelSession(
  id: string
): CalendarSession[] {
  return updateSession(id, {
    status: 'cancelled'
  })
}

export function getSessionsByDay(
  date: string
): CalendarSession[] {
  return getSessions().filter(
    (s) => s.date === date
  )
}

export function getSessionsByMonth(
  yearMonth: string
): CalendarSession[] {
  return getSessions().filter((s) =>
    s.date.startsWith(yearMonth)
  )
}

export function getDaysWithSessions(
  yearMonth: string
): Set<string> {
  return new Set(
    getSessionsByMonth(yearMonth).map(
      (s) => s.date
    )
  )
}

export function getSessionStats() {
  const all = getSessions()

  return {
    total: all.length,

    upcoming: all.filter(
      (s) => s.status === 'upcoming'
    ).length,

    ongoing: all.filter(
      (s) => s.status === 'ongoing'
    ).length,

    done: all.filter(
      (s) => s.status === 'done'
    ).length,

    cancelled: all.filter(
      (s) => s.status === 'cancelled'
    ).length,
=======
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
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
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