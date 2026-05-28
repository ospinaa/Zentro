// ─── src/pages/ProjectsPage.tsx ───────────────────────────────────────────────
// Ahora consume el ProjectContext en lugar de manejar estado local.
// Las funciones createProject, addTask, changeTaskStatus y moveTask
// vienen del context y persisten automáticamente en localStorage.


import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { useProjects } from '../context/ProjectContext'
import { useProfile } from '../context/ProfileContexts'


// ── Tipos exportados (los componentes los importan desde aquí) ────────────────

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
  const { projects, createProject, addTask, changeTaskStatus, moveTask } =
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
            <p className="proj-page__eyebrow">Gestión de proyectos</p>
            <h1>Projects</h1>
            <p>
              Gestiona tus tareas, sigue el progreso y colabora en tus proyectos.
            </p>
          </div>
          <button
            type="button"
            className="proj-page__new-btn"
            onClick={() => setShowModal(true)}
          >
            + Nuevo proyecto
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