// src/services/likeService.ts
// Gestiona likes de eventos en Supabase.
// Tabla requerida:
//   event_likes (id uuid pk, firebase_uid text, event_id text, event_type text, created_at timestamptz)
//   Unique constraint en (firebase_uid, event_id, event_type)

import { supabase } from './supabase'
import { auth } from './firebase'

export type EventType = 'academic' | 'sports'

export interface LikeState {
  count: number
  likedByMe: boolean
}

