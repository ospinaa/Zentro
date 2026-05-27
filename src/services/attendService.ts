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

/** Obtiene el conteo de likes y si el usuario actual dio like */
export async function getLikes(
  eventId: string,
  eventType: EventType,
): Promise<LikeState> {
  const uid = auth.currentUser?.uid ?? null

  const { count } = await supabase
    .from('event_likes')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('event_type', eventType)

  let likedByMe = false
  if (uid) {
    const { data } = await supabase
      .from('event_likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('event_type', eventType)
      .eq('firebase_uid', uid)
      .maybeSingle()
    likedByMe = !!data
  }

  return { count: count ?? 0, likedByMe }
}

