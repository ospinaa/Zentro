import { useRef, useState } from 'react'
import type { CollaborativeTask, TaskStatus } from '../services/Collaborativeprojectservice'

const STATUS_LABELS: Record<TaskStatus, string> = {
  'pending': 'Pendiente',
  'in-progress': 'En progreso',
  'completed': 'Listo',
  'blocked': 'Bloqueada',
}

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  'pending': 'in-progress',
  'in-progress': 'completed',
  'completed': 'pending',
  'blocked': 'pending',
}

interface TaskListProps {
  projectId: string
  tasks: CollaborativeTask[]
  filterStatus: TaskStatus | 'all'
  onAddTask: (projectId: string, title: string) => void
  onChangeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void
  onMoveTask: (projectId: string, fromIndex: number, toIndex: number) => void
}

export function TaskList({ projectId, tasks, filterStatus, onAddTask, onChangeTaskStatus, onMoveTask }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const dragIndex = useRef<number | null>(null)

  const filtered = filterStatus === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filterStatus)

  function handleAddTask() {
    if (!newTaskTitle.trim()) return
    onAddTask(projectId, newTaskTitle.trim())
    setNewTaskTitle('')
  }

  function handleDragStart(index: number) {
    dragIndex.current = index
  }

  function handleDrop(toIndex: number) {
    if (dragIndex.current === null || dragIndex.current === toIndex) return
    const fromTask = filtered[dragIndex.current]
    const toTask = filtered[toIndex]
    const realFrom = tasks.findIndex((t) => t.id === fromTask.id)
    const realTo = tasks.findIndex((t) => t.id === toTask.id)
    onMoveTask(projectId, realFrom, realTo)
    dragIndex.current = null
  }

  return (
    <div className="tl-root">
      <div className="tl-add">
        <input
          className="auth-input tl-add__input"
          placeholder="Add a task…"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button type="button" className="tl-add__btn" onClick={handleAddTask}>+</button>
      </div>

      {filtered.length === 0 ? (
        <p className="tl-empty">
          No tasks{filterStatus !== 'all' ? ` with status "${STATUS_LABELS[filterStatus as TaskStatus]}"` : ''}.
        </p>
      ) : (
        <ul className="tl-list">
          {filtered.map((task, i) => (
            <li
              key={task.id}
              className="tl-item"
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
            >
              <span className="tl-item__drag">⠿</span>
              <span className={`tl-item__title ${task.status === 'completed' ? 'tl-item__title--completed' : ''}`}>
                {task.title}
              </span>
              <button
                type="button"
                className={`tl-item__badge tl-item__badge--${task.status as 'pending' | 'in-progress' | 'completed'}`}
                onClick={() => onChangeTaskStatus(projectId, task.id, STATUS_CYCLE[task.status])}
                title="Click to advance status"
              >
                {STATUS_LABELS[task.status as TaskStatus]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}