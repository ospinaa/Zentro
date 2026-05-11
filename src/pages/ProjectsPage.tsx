
import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { useProjects } from '../context/ProjectContext'
import { useProfile } from '../context/ProfileContexts'



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


export function ProjectsPage() {
  const { projects, createProject, addTask, changeTaskStatus, moveTask, removeTask } =
    useProjects()
  const { userInitials } = useProfile()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.title = 'Projects · Zentro'
  }, [])

  return (
    <DashboardLayout userInitials={userInitials}>
      <div className="proj-page">
        <div className="proj-page__top">
          <div>
            <h1 className="dash-hero__title">Projects</h1>
            <p className="dash-hero__subtitle">
              Manage your tasks and track progress
            </p>
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
            <p className="dash-placeholder__text">
              No projects yet. Create your first one!
            </p>
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
          onSubmit={(name, description) => {
            createProject(name, description)
            setShowModal(false)
          }}
        />
      )}
    </DashboardLayout>
  )
}