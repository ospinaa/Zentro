import { useState } from 'react'
import type { Project, Task, TaskStatus } from '../pages/ProjectsPage'
import { TaskList } from './TaskList'

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

interface ProjectCardProps {
  project: Project
  onAddTask: (projectId: string, title: string) => void
  onChangeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void
  onMoveTask: (projectId: string, fromIndex: number, toIndex: number) => void
}

export function ProjectCard({ project, onAddTask, onChangeTaskStatus, onMoveTask }: ProjectCardProps) {
  const [open, setOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')

  const progressColor =
    project.progress === 100 ? '#4caf82' :
    project.progress >= 50  ? '#f0a500' : '#e05c5c'

  return (
    <article className="pc-card">
      <div
        className="pc-header"
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      >
        <div className="pc-header__info">
          <h3 className="pc-name">{project.name}</h3>
          {project.description && <p className="pc-desc">{project.description}</p>}
        </div>
        <span className="pc-chevron">{open ? '▲' : '▼'}</span>
      </div>

      <div className="pc-progress-wrap" aria-label={`Progress: ${project.progress}%`}>
        <div className="pc-progress-track">
          <div className="pc-progress-fill" style={{ width: `${project.progress}%`, background: progressColor }} />
        </div>
        <span className="pc-progress-pct">{project.progress}%</span>
      </div>

      <div className="pc-stats">
        <span className="pc-stat pc-stat--total">{project.tasks.length} tasks</span>
        <span className="pc-stat pc-stat--done">{project.tasks.filter((t: Task) => t.status === 'done').length} done</span>
        <span className="pc-stat pc-stat--wip">{project.tasks.filter((t: Task) => t.status === 'in-progress').length} in progress</span>
      </div>

      {open && (
        <div className="pc-tasks">
          <div className="pc-filter">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`pc-filter__btn ${filterStatus === opt.value ? 'pc-filter__btn--active' : ''}`}
                onClick={() => setFilterStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <TaskList
            projectId={project.id}
            tasks={project.tasks}
            filterStatus={filterStatus}
            onAddTask={onAddTask}
            onChangeTaskStatus={onChangeTaskStatus}
            onMoveTask={onMoveTask}
          />
        </div>
      )}
    </article>
  )
}