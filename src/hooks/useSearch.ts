// ─── src/hooks/useSearch.ts ───────────────────────────────────────────────────
// Hook reutilizable que conecta el searchService con React.
// Incluye debounce para no buscar en cada keystroke.

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Project, TaskStatus } from '../pages/ProjectsPage'
import type { CalendarSession, SessionStatus } from '../services/sessionService'
import {
  search,
  type ResultKind,
  type SearchFilters,
  type SearchResult,
} from '../services/searchService'

interface UseSearchOptions {
  projects: Project[]
  sessions: CalendarSession[]
  debounceMs?: number
}

interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void

  filters: SearchFilters
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  resetFilters: () => void

  results: SearchResult[]
  isSearching: boolean   // true mientras espera el debounce
  hasQuery: boolean      // true si hay búsqueda activa
  resultCount: number
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  taskStatus: 'all',
  sessionStatus: 'all',
  dateFrom: undefined,
  dateTo: undefined,
  tags: [],
  kinds: [],
}

export function useSearch({
  projects,
  sessions,
  debounceMs = 250,
}: UseSearchOptions): UseSearchReturn {
  const [query, setQueryRaw]         = useState('')
  const [debouncedQuery, setDebounced] = useState('')
  const [isSearching, setIsSearching]  = useState(false)
  const [filters, setFilters]          = useState<SearchFilters>(DEFAULT_FILTERS)

  // ── Debounce del query ────────────────────────────────────────────────────

  useEffect(() => {
    if (query === debouncedQuery) return
    setIsSearching(true)
    const t = setTimeout(() => {
      setDebounced(query)
      setIsSearching(false)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [query, debouncedQuery, debounceMs])

  // ── Setters ───────────────────────────────────────────────────────────────

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q)
    setFilters((prev) => ({ ...prev, query: q }))
  }, [])

  const setFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setQueryRaw('')
    setDebounced('')
    setFilters(DEFAULT_FILTERS)
  }, [])

  // ── Búsqueda memoizada ────────────────────────────────────────────────────

  const results = useMemo(
    () => search(projects, sessions, { ...filters, query: debouncedQuery }),
    [projects, sessions, filters, debouncedQuery]
  )

  return {
    query,
    setQuery,
    filters,
    setFilter,
    resetFilters,
    results,
    isSearching,
    hasQuery:    debouncedQuery.trim().length > 0 || filters.kinds?.length !== 0,
    resultCount: results.length,
  }
}