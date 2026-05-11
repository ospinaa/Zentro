// ─── src/context/SessionContext.tsx ───────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  CalendarSession,
} from "../services/sessionService";

import * as sessionService from "../services/sessionService";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface SessionContextValue {

  sessions: CalendarSession[];

  selectedDate: string;

  currentMonth: string;

  setSelectedDate: (
    date: string
  ) => void;

  setCurrentMonth: (
    month: string
  ) => void;

  daysWithSessions: Set<string>;

  sessionsOfDay: CalendarSession[];

  refreshSessions: () => Promise<void>;

  addSession: (
    data: Omit<
      CalendarSession,
      "id" | "status" | "createdAt"
    >
  ) => Promise<void>;

  editSession: (
    id: string,
    fields: Partial<
      Omit<
        CalendarSession,
        "id" | "createdAt"
      >
    >
  ) => Promise<void>;

  removeSession: (
    id: string
  ) => Promise<void>;

  cancelSession: (
    id: string
  ) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const SessionContext =
  createContext<SessionContextValue | null>(
    null
  );

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function currentMonthISO(): string {
  return new Date()
    .toISOString()
    .slice(0, 7);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function SessionProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [sessions, setSessions] = useState<
    CalendarSession[]
  >([]);

  const [selectedDate, setSelectedDate] =
    useState(todayISO);

  const [currentMonth, setCurrentMonth] =
    useState(currentMonthISO);

  // ── Cargar sesiones ────────────────────────────────────────────────────────

  const loadSessions = useCallback(
    async () => {

      try {

        const data =
          await sessionService.getSessions();

        setSessions(data);

      } catch (error) {

        console.error(
          "Error cargando sesiones:",
          error
        );
      }
    },
    []
  );

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // ── Crear sesión ───────────────────────────────────────────────────────────

  const addSession = useCallback(
    async (
      data: Omit<
        CalendarSession,
        "id" | "status" | "createdAt"
      >
    ) => {

      try {

        const updated =
          await sessionService.addSession(
            data
          );

        setSessions(updated);

      } catch (error) {

        console.error(
          "Error creando sesión:",
          error
        );
      }
    },
    []
  );

  // ── Editar sesión ──────────────────────────────────────────────────────────

  const editSession = useCallback(
    async (
      id: string,
      fields: Partial<
        Omit<
          CalendarSession,
          "id" | "createdAt"
        >
      >
    ) => {

      try {

        const updated =
          await sessionService.updateSession(
            id,
            fields
          );

        setSessions(updated);

      } catch (error) {

        console.error(
          "Error editando sesión:",
          error
        );
      }
    },
    []
  );

  // ── Eliminar sesión ────────────────────────────────────────────────────────

  const removeSession = useCallback(
    async (
      id: string
    ) => {

      try {

        const updated =
          await sessionService.deleteSession(
            id
          );

        setSessions(updated);

      } catch (error) {

        console.error(
          "Error eliminando sesión:",
          error
        );
      }
    },
    []
  );

  // ── Cancelar sesión ────────────────────────────────────────────────────────

  const cancelSession = useCallback(
    async (
      id: string
    ) => {

      try {

        const updated =
          await sessionService.cancelSession(
            id
          );

        setSessions(updated);

      } catch (error) {

        console.error(
          "Error cancelando sesión:",
          error
        );
      }
    },
    []
  );

  // ── Datos derivados ────────────────────────────────────────────────────────

  const daysWithSessions =
    sessionService.getDaysWithSessions(
      sessions,
      currentMonth
    );

  const sessionsOfDay =
    sessionService.getSessionsByDay(
      sessions,
      selectedDate
    );

  // ── Provider ───────────────────────────────────────────────────────────────

  return (
    <SessionContext.Provider
      value={{

        sessions,

        selectedDate,
        currentMonth,

        setSelectedDate,
        setCurrentMonth,

        daysWithSessions,

        sessionsOfDay,

        refreshSessions:
          loadSessions,

        addSession,

        editSession,

        removeSession,

        cancelSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSessions(): SessionContextValue {

  const ctx =
    useContext(SessionContext);

  if (!ctx) {
    throw new Error(
      "useSessions debe usarse dentro de <SessionProvider>"
    );
  }

  return ctx;
}