export interface Subtask {
  id: string
  title: string
  completed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  date?: string
  order: number
  subtasks?: Subtask[]
  createdAt: string
  updatedAt: string
}

export interface CreateTodoDto {
  title: string
  description?: string
  date?: string
  subtasks?: Omit<Subtask, 'id' | 'createdAt' | 'updatedAt'>[]
}

export interface UpdateTodoDto {
  title?: string
  description?: string
  completed?: boolean
  date?: string
  order?: number
  subtasks?: Subtask[]
}

export interface ReorderTodosDto {
  todoIds: string[]
}

