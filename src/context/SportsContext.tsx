import { createContext, useContext, useEffect, useState, type ReactNode, } from "react";
import * as sportsService from "../services/sportService";
import type { SportsEvent } from "../services/sportService";

interface SportsContextValue {

  events: SportsEvent[];

  addEvent: (
    data: Omit<
      SportsEvent,
      "id" |
      "firebase_uid" |
      "createdAt"
    >
  ) => Promise<void>;

  editEvent: (
    id: string,
    fields: Partial<SportsEvent>
  ) => Promise<void>;

  removeEvent: (
    id: string
  ) => Promise<void>;
}

const SportsContext =
  createContext<SportsContextValue | null>(
    null
  );

export function SportsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [events, setEvents] =
    useState<SportsEvent[]>([]);

  async function loadEvents() {

    const data =
      await sportsService.getSportsEvents();

    setEvents(data);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function addEvent(
    data: Omit<
      SportsEvent,
      "id" |
      "firebase_uid" |
      "createdAt"
    >
  ) {

    const updated =
      await sportsService.addSportsEvent(
        data
      );

    setEvents(updated);
  }

  async function editEvent(
    id: string,
    fields: Partial<SportsEvent>
  ) {

    const updated =
      await sportsService.updateSportsEvent(
        id,
        fields
      );

    setEvents(updated);
  }

  async function removeEvent(
    id: string
  ) {

    const updated =
      await sportsService.deleteSportsEvent(
        id
      );

    setEvents(updated);
  }

  return (
    <SportsContext.Provider
      value={{
        events,

        addEvent,

        editEvent,

        removeEvent,
      }}
    >
      {children}
    </SportsContext.Provider>
  );
}

export function useSports() {

  const ctx =
    useContext(SportsContext);

  if (!ctx) {
    throw new Error(
      "useSports debe usarse dentro del provider"
    );
  }

  return ctx;
}