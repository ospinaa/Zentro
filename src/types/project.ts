export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus

  description?: string
  dueDate?: string | null
  assigneeUid?: string | null
}

export interface Project {
  id: string
  name: string
  description: string

  tasks: Task[]

  progress?: number
  createdAt?: number
}