// src/context/CollaborativeProjectContext.tsx
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from 'react'
  import { useAuth } from './AuthContext'
  import * as svc from '../services/Collaborativeprojectservice'
  import type {
    CollaborativeProject,
    MemberRole,
    ProjectType,
    TaskStatus,
  } from '../services/Collaborativeprojectservice'
  
  interface CollaborativeProjectContextValue {
    projects: CollaborativeProject[]
    loading: boolean
    refreshProjects: () => Promise<void>
  
    createProject: (
      name: string,
      description: string,
      type: ProjectType,
      collaboratorUids: string[]
    ) => Promise<void>
  
    removeProject: (id: string) => Promise<void>
    editProject: (id: string, name: string, description: string) => Promise<void>
  
    addMember: (projectId: string, userUid: string, role?: MemberRole) => Promise<void>
    removeMember: (projectId: string, userUid: string) => Promise<void>
  
    createTask: (
      projectId: string,
      title: string,
      description: string,
      assigneeUid: string | null,
      dueDate: string | null
    ) => Promise<void>
  
    changeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>
    removeTask: (taskId: string) => Promise<void>
  }
  
  const CollaborativeProjectContext =
    createContext<CollaborativeProjectContextValue | null>(null)
  
  export function CollaborativeProjectProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth()
    const [projects, setProjects] = useState<CollaborativeProject[]>([])
    const [loading, setLoading] = useState(true)
  
    const refreshProjects = useCallback(async () => {
      if (!user) { setProjects([]); setLoading(false); return }
      setLoading(true)
      const data = await svc.getMyProjects()
      setProjects(data)
      setLoading(false)
    }, [user])
  
    useEffect(() => {
      if (!authLoading) refreshProjects()
    }, [authLoading, refreshProjects])
  
    const createProject = useCallback(
      async (name: string, description: string, type: ProjectType, collaboratorUids: string[]) => {
        await svc.createProject(name, description, type, collaboratorUids)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const removeProject = useCallback(
      async (id: string) => {
        await svc.deleteProject(id)
        setProjects((prev) => prev.filter((p) => p.id !== id))
      },
      []
    )
  
    const editProject = useCallback(
      async (id: string, name: string, description: string) => {
        await svc.updateProjectInfo(id, { name, description })
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const addMember = useCallback(
      async (projectId: string, userUid: string, role?: MemberRole) => {
        await svc.addMember(projectId, userUid, role)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const removeMember = useCallback(
      async (projectId: string, userUid: string) => {
        await svc.removeMember(projectId, userUid)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const createTask = useCallback(
      async (
        projectId: string,
        title: string,
        description: string,
        assigneeUid: string | null,
        dueDate: string | null
      ) => {
        await svc.createTask(projectId, title, description, assigneeUid, dueDate)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const changeTaskStatus = useCallback(
      async (projectId: string, taskId: string, status: TaskStatus) => {
        await svc.updateTaskStatus(projectId, taskId, status)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    const removeTask = useCallback(
      async (taskId: string) => {
        await svc.deleteTask(taskId)
        await refreshProjects()
      },
      [refreshProjects]
    )
  
    return (
      <CollaborativeProjectContext.Provider
        value={{
          projects,
          loading,
          refreshProjects,
          createProject,
          removeProject,
          editProject,
          addMember,
          removeMember,
          createTask,
          changeTaskStatus,
          removeTask,
        }}
      >
        {children}
      </CollaborativeProjectContext.Provider>
    )
  }
  
  export function useCollaborativeProjects(): CollaborativeProjectContextValue {
    const ctx = useContext(CollaborativeProjectContext)
    if (!ctx) throw new Error('useCollaborativeProjects must be inside CollaborativeProjectProvider')
    return ctx
  }