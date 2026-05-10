// ─── src/services/projectService.ts ───────────────────────────────────────────
// Capa de servicio que abstrae el acceso a datos de proyectos y tareas.
// Usa localStorage para persistencia simulada (fácil de reemplazar por API real).

import type { Project, Task, TaskStatus } from '../pages/ProjectsPage'

const STORAGE_KEY = 'zentro_projects'

// ── Helpers internos ──────────────────────────────────────────────────────────

export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

/**
 * Calcula el progreso de un proyecto.
 * Fórmula: (tareas completadas / total tareas) * 100
 */
export function calcProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

// ── Lectura / Escritura ───────────────────────────────────────────────────────

/** Carga todos los proyectos desde localStorage. */
export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch {
    return []
  }
}

/** Persiste el array completo de proyectos. */
function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

// ── Proyectos ─────────────────────────────────────────────────────────────────

/**
 * Crea un proyecto nuevo y lo guarda.
 * Recibe datos del formulario y los guarda en el estado persistido.
 */
export function addProject(name: string, description: string): Project {
  const project: Project = {
    id: uid(),
    name,
    description,
    tasks: [],
    progress: 0,
  }
  const projects = getProjects()
  saveProjects([...projects, project])
  return project
}

/** Elimina un proyecto por ID. */
export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.id !== projectId)
  saveProjects(projects)
}

/** Actualiza nombre o descripción de un proyecto existente. */
export function updateProject(
  projectId: string,
  fields: Partial<Pick<Project, 'name' | 'description'>>
): Project[] {
  const projects = getProjects().map((p) =>
    p.id === projectId ? { ...p, ...fields } : p
  )
  saveProjects(projects)
  return projects
}

// ── Tareas ────────────────────────────────────────────────────────────────────

/**
 * Agrega una tarea dentro de un proyecto específico.
 * La tarea comienza con estado 'todo'.
 */
export function addTask(projectId: string, title: string): Project[] {
  const newTask: Task = { id: uid(), title, status: 'todo' }
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = [...p.tasks, newTask]
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}

/**
 * Modifica el estado de una tarea y recalcula el progreso del proyecto.
 * Función: Cambiar Estado → recalcula progreso automáticamente.
 */
export function updateTask(
  projectId: string,
  taskId: string,
  status: TaskStatus
): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}

/** Elimina una tarea de un proyecto y recalcula el progreso. */
export function deleteTask(projectId: string, taskId: string): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = p.tasks.filter((t) => t.id !== taskId)
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}

/**
 * Reordena tareas dentro de un proyecto (drag & drop).
 * Mueve la tarea de fromIndex a toIndex.
 */
export function moveTask(
  projectId: string,
  fromIndex: number,
  toIndex: number
): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = [...p.tasks]
    const [moved] = tasks.splice(fromIndex, 1)
    tasks.splice(toIndex, 0, moved)
    return { ...p, tasks }
  })
  saveProjects(projects)
  return projects
}

/**
 * Retorna estadísticas resumidas de un proyecto.
 * Útil para dashboards o reportes rápidos.
 */
export function getProjectStats(project: Project) {
  const total = project.tasks.length
  const done = project.tasks.filter((t) => t.status === 'done').length
  const inProgress = project.tasks.filter((t) => t.status === 'in-progress').length
  const todo = project.tasks.filter((t) => t.status === 'todo').length
  return { total, done, inProgress, todo, progress: project.progress }
}