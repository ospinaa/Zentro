// src/context/AcademicContext.tsx
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import * as academicService from "../services/academicService";
import type { AcademicEvent } from "../services/academicService";

interface AcademicContextValue {
  events: AcademicEvent[];
  addEvent: (
    data: Omit<AcademicEvent, "id" | "firebase_uid" | "createdAt">
  ) => Promise<void>;
  editEvent: (id: string, fields: Partial<AcademicEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

const AcademicContext = createContext<AcademicContextValue | null>(null);

export function AcademicProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AcademicEvent[]>([]);

  async function loadEvents() {
    const data = await academicService.getAcademicEvents();
    setEvents(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, []);

  async function addEvent(
    data: Omit<AcademicEvent, "id" | "firebase_uid" | "createdAt">
  ) {
    const updated = await academicService.addAcademicEvent(data);
    setEvents(updated);
  }

  async function editEvent(id: string, fields: Partial<AcademicEvent>) {
    const updated = await academicService.updateAcademicEvent(id, fields);
    setEvents(updated);
  }

  async function removeEvent(id: string) {
    const updated = await academicService.deleteAcademicEvent(id);
    setEvents(updated);
  }

  return (
    <AcademicContext.Provider value={{ events, addEvent, editEvent, removeEvent }}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error("useAcademic debe usarse dentro del provider");
  return ctx;
}