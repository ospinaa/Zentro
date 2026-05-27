// src/components/EventPage.tsx
//
// Generic reusable page for community events (Academic, Sports, etc.)
// Eliminates the ~95% duplicate code between AcademicPage and SportsPage.
//
import { useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { auth } from '../services/firebase'

export interface GenericEvent {
  id: string
  firebase_uid: string
  title: string
  description: string
  eventTime: string
  externalLink: string
  createdAt: number
}

