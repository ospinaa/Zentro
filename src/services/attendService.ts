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

/** Toggle like: si ya existe lo borra, si no existe lo crea */
export async function toggleLike(
  eventId: string,
  eventType: EventType,
): Promise<LikeState> {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No autenticado')

  const { data: existing } = await supabase
    .from('event_likes')
    .select('id')
    .eq('event_id', eventId)
    .eq('event_type', eventType)
    .eq('firebase_uid', uid)
    .maybeSingle()

  if (existing) {
    await supabase.from('event_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('event_likes').insert([{
      firebase_uid: uid,
      event_id: eventId,
      event_type: eventType,
    }])
  }

  return getLikes(eventId, eventType)
}

/** Carga los likes de múltiples eventos en una sola query */
export async function getBulkLikes(
  eventIds: string[],
  eventType: EventType,
): Promise<Record<string, LikeState>> {
  if (eventIds.length === 0) return {}
  const uid = auth.currentUser?.uid ?? null

  const { data: allLikes } = await supabase
    .from('event_likes')
    .select('event_id, firebase_uid')
    .in('event_id', eventIds)
    .eq('event_type', eventType)

  const result: Record<string, LikeState> = {}
  for (const id of eventIds) {
    const rows = allLikes?.filter(r => r.event_id === id) ?? []
    result[id] = {
      count: rows.length,
      likedByMe: uid ? rows.some(r => r.firebase_uid === uid) : false,
    }
  }
  return result
}