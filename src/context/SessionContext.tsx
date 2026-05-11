
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
  } from 'react'
  import type { CalendarSession, SessionStatus } from '../services/sessionService'
  import * as sessionService from '../services/sessionService'
  

  
  interface SessionContextValue {
    sessions: CalendarSession[]
  

    selectedDate: string
  

    currentMonth: string
  
    setSelectedDate: (date: string) => void
    setCurrentMonth: (month: string) => void
  

    daysWithSessions: Set<string>
  

    sessionsOfDay: CalendarSession[]
  
    addSession: (data: Omit<CalendarSession, 'id' | 'status' | 'createdAt'>) => void
    editSession: (id: string, fields: Partial<Omit<CalendarSession, 'id' | 'createdAt'>>) => void
    removeSession: (id: string) => void
    cancelSession: (id: string) => void
  }
  

  
  const SessionContext = createContext<SessionContextValue | null>(null)
    
  function todayISO(): string {
    return new Date().toISOString().slice(0, 10)
  }
  
  function currentMonthISO(): string {
    return new Date().toISOString().slice(0, 7)
  }
  
  
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
  
  
  export function useSessions(): SessionContextValue {
    const ctx = useContext(SessionContext)
    if (!ctx) throw new Error('useSessions debe usarse dentro de <SessionProvider>')
    return ctx
  }