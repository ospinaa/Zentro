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

interface ProjectContextValue {
  projects: Project[]

  /** Crear proyecto: recibe datos del formulario y los guarda en estado global. */
  createProject: (name: string, description: string) => void

  /** Eliminar un proyecto completo. */
  removeProject: (projectId: string) => void

  /** Editar nombre/descripción de un proyecto. */
  editProject: (projectId: string, name: string, description: string) => void

  /** Agregar tarea dentro de un proyecto específico. */
  addTask: (projectId: string, title: string) => void

  /**
   * Cambiar Estado: modifica el estado de una tarea
   * y recalcula el progreso automáticamente.
   */
  changeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void

  /** Eliminar tarea de un proyecto. */
  removeTask: (projectId: string, taskId: string) => void

  /** Reordenar tareas (drag & drop). */
  moveTask: (projectId: string, fromIndex: number, toIndex: number) => void
}

// ── Creación del context ──────────────────────────────────────────────────────

const ProjectContext = createContext<ProjectContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Carga inicial desde localStorage vía el servicio
  const [projects, setProjects] = useState<Project[]>(() =>
    projectService.getProjects()
  )

  // Sincroniza cada vez que projects cambia (por si se abre otra pestaña)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'zentro_projects') {
        setProjects(projectService.getProjects())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])



  const createProject = useCallback((name: string, description: string) => {
    projectService.addProject(name, description)
    setProjects(projectService.getProjects())
  }, [])

  const removeProject = useCallback((projectId: string) => {
    projectService.deleteProject(projectId)
    setProjects(projectService.getProjects())
  }, [])

  const editProject = useCallback(
    (projectId: string, name: string, description: string) => {
      setProjects(projectService.updateProject(projectId, { name, description }))
    },
    []
  )

  const addTask = useCallback((projectId: string, title: string) => {
    setProjects(projectService.addTask(projectId, title))
  }, [])

  const changeTaskStatus = useCallback(
    (projectId: string, taskId: string, status: TaskStatus) => {
      setProjects(projectService.updateTask(projectId, taskId, status))
    },
    []
  )

  const removeTask = useCallback((projectId: string, taskId: string) => {
    setProjects(projectService.deleteTask(projectId, taskId))
  }, [])

  const moveTask = useCallback(
    (projectId: string, fromIndex: number, toIndex: number) => {
      setProjects(projectService.moveTask(projectId, fromIndex, toIndex))
    },
    []
  )

  return (
    <ProjectContext.Provider
      value={{
        projects,
        createProject,
        removeProject,
        editProject,
        addTask,
        changeTaskStatus,
        removeTask,
        moveTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}


export function useProjects(): ProjectContextValue {
  const ctx = useContext(ProjectContext)
  if (!ctx) {
    throw new Error('useProjects debe usarse dentro de <ProjectProvider>')
  }
  return ctx
}