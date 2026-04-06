import { useEffect, useRef, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'


export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
}

export interface Project {
  id: string
  name: string
  description: string
  tasks: Task[]
  progress: number
}


function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function calcProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}


export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.title = 'Projects · Zentro'
  }, [])

  function createProject(name: string, description: string) {
    setProjects((prev) => [
      ...prev,
      { id: uid(), name, description, tasks: [], progress: 0 },
    ])
  }

  function addTask(projectId: string, title: string) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const tasks = [...p.tasks, { id: uid(), title, status: 'todo' as TaskStatus }]
        return { ...p, tasks, progress: calcProgress(tasks) }
      })
    )
  }

  function changeTaskStatus(projectId: string, taskId: string, status: TaskStatus) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const tasks = p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
        return { ...p, tasks, progress: calcProgress(tasks) }
      })
    )
  }

  function moveTask(projectId: string, fromIndex: number, toIndex: number) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const tasks = [...p.tasks]
        const [moved] = tasks.splice(fromIndex, 1)
        tasks.splice(toIndex, 0, moved)
        return { ...p, tasks }
      })
    )
  }

  return (
    <DashboardLayout userInitials="U">
      <div className="proj-page">
        <div className="proj-page__top">
          <div>
            <h1 className="dash-hero__title">Projects</h1>
            <p className="dash-hero__subtitle">Manage your tasks and track progress</p>
          </div>
          <button
            type="button"
            className="proj-page__new-btn"
            onClick={() => setShowModal(true)}
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="dash-placeholder">
            <p className="dash-placeholder__text">No projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="proj-list">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onAddTask={addTask}
                onChangeTaskStatus={changeTaskStatus}
                onMoveTask={moveTask}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSubmit={createProject}
        />
      )}
    </DashboardLayout>
  )
}