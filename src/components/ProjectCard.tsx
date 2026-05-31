// src/components/ProjectCard.tsx
import { useState } from 'react'
import type { CollaborativeProject, CollaborativeTask, TaskStatus } from '../services/Collaborativeprojectservice'
import { TaskList } from './TaskList'

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Por hacer' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'completed', label: 'Listo' },
]

interface ProjectCardProps {
  project: CollaborativeProject
  onAddTask: (projectId: string, title: string) => void
  onChangeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void
  onMoveTask: (projectId: string, fromIndex: number, toIndex: number) => void
}

// ── Inline circular progress (no import needed) ─────────────────
function CircularProgress({ pct, color = '#7c3aed', size = 46, stroke = 4 }: {
  pct: number; color?: string; size?: number; stroke?: number
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

export function ProjectCard({ project, onAddTask, onChangeTaskStatus, onMoveTask }: ProjectCardProps) {
  const [open, setOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')

  const progressColor =
    project.progress === 100 ? '#16a34a' :
    project.progress >= 50  ? '#d97706' : '#7c3aed'

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
        <div className="pc-header__right">
          {/* Circular progress replaces the horizontal bar */}
          <div className="pc-circle-wrap">
            <CircularProgress pct={project.progress} color={progressColor} />
            <span className="pc-circle-pct">{project.progress}%</span>
          </div>
          <span className="pc-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      <div className="pc-stats">
        <span className="pc-stat pc-stat--total">{project.tasks.length} tareas</span>
        <span className="pc-stat pc-stat--done">{project.tasks.filter((t: CollaborativeTask) => t.status === 'completed').length} listas</span>
        <span className="pc-stat pc-stat--wip">{project.tasks.filter((t: CollaborativeTask) => t.status === 'in-progress').length} en progreso</span>
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