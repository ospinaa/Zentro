// ─── src/context/SessionContext.tsx ───────────────────────────────────────────
// Context global para el calendario de sesiones.
// Expone CRUD completo y la fecha seleccionada actualmente en el calendario.

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
  } from 'react'
  import type { CalendarSession, SessionStatus } from '../services/sessionService'
  import * as sessionService from '../services/sessionService'
  
  // ── Tipos ─────────────────────────────────────────────────────────────────────
  
  interface SessionContextValue {
    sessions: CalendarSession[]
  
    /** Fecha actualmente seleccionada en el calendario (ISO: 'YYYY-MM-DD'). */
    selectedDate: string
  
    /** Mes visible en el calendario (ISO: 'YYYY-MM'). */
    currentMonth: string
  
    setSelectedDate: (date: string) => void
    setCurrentMonth: (month: string) => void
  
    /** Días del mes visible que tienen sesiones. */
    daysWithSessions: Set<string>
  
    /** Sesiones del día seleccionado. */
    sessionsOfDay: CalendarSession[]
  
    addSession: (data: Omit<CalendarSession, 'id' | 'status' | 'createdAt'>) => void
    editSession: (id: string, fields: Partial<Omit<CalendarSession, 'id' | 'createdAt'>>) => void
    removeSession: (id: string) => void
    cancelSession: (id: string) => void
  }
  
  // ── Context ───────────────────────────────────────────────────────────────────
  
  const SessionContext = createContext<SessionContextValue | null>(null)
  
  // ── Helpers de fecha ──────────────────────────────────────────────────────────
  
  function todayISO(): string {
    return new Date().toISOString().slice(0, 10)
  }
  
  function currentMonthISO(): string {
    return new Date().toISOString().slice(0, 7)
  }
  
  // ── Provider ──────────────────────────────────────────────────────────────────
  
  export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessions, setSessions] = useState<CalendarSession[]>(() =>
      sessionService.getSessions()
    )
    const [selectedDate, setSelectedDate] = useState(todayISO)
    const [currentMonth, setCurrentMonth] = useState(currentMonthISO)
  
    const daysWithSessions = sessionService.getDaysWithSessions(currentMonth)
    const sessionsOfDay = sessions.filter((s) => s.date === selectedDate)
  
    const addSession = useCallback(
      (data: Omit<CalendarSession, 'id' | 'status' | 'createdAt'>) => {
        setSessions(sessionService.addSession(data))
      },
      []
    )
  
    const editSession = useCallback(
      (id: string, fields: Partial<Omit<CalendarSession, 'id' | 'createdAt'>>) => {
        setSessions(sessionService.updateSession(id, fields))
      },
      []
    )
  
    const removeSession = useCallback((id: string) => {
      setSessions(sessionService.deleteSession(id))
    }, [])
  
    const cancelSession = useCallback((id: string) => {
      setSessions(sessionService.cancelSession(id))
    }, [])
  
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
          addSession,
          editSession,
          removeSession,
          cancelSession,
        }}
      >
        {children}
      </SessionContext.Provider>
    )
  }
  
  // ── Hook ──────────────────────────────────────────────────────────────────────
  
  export function useSessions(): SessionContextValue {
    const ctx = useContext(SessionContext)
    if (!ctx) throw new Error('useSessions debe usarse dentro de <SessionProvider>')
    return ctx
  }