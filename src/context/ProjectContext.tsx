/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Project, TaskStatus } from '../types/project'
import * as projectService from '../services/projectService'


interface ProjectContextValue {
  projects: Project[]

  createProject: (name: string, description: string) => void

  removeProject: (projectId: string) => void

  editProject: (projectId: string, name: string, description: string) => void

  addTask: (projectId: string, title: string) => void

  changeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void

  removeTask: (projectId: string, taskId: string) => void

  moveTask: (projectId: string, fromIndex: number, toIndex: number) => void
}


const ProjectContext = createContext<ProjectContextValue | null>(null)


export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() =>
    projectService.getProjects()
  )

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