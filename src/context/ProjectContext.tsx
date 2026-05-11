// ─── src/context/ProjectContext.tsx ───────────────────────────────────────────
// Context global de proyectos.
// Centraliza el estado y expone las funciones del projectService
// para que cualquier componente pueda consumirlas sin prop drilling.

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from 'react'
  import type { Project, TaskStatus } from '../pages/ProjectsPage'
  import * as projectService from '../services/projectService'
  
  // ── Tipos ─────────────────────────────────────────────────────────────────────
  
