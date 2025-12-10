import axios from 'axios'
import type { Todo, CreateTodoDto, UpdateTodoDto, ReorderTodosDto } from '@/types/todo'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const { data } = await api.get<Todo[]>('/todos')
    return data
  },

  getById: async (id: string): Promise<Todo> => {
    const { data } = await api.get<Todo>(`/todos/${id}`)
    return data
  },

  create: async (todo: CreateTodoDto): Promise<Todo> => {
    const { data } = await api.post<Todo>('/todos', todo)
    return data
  },

  update: async (id: string, todo: UpdateTodoDto): Promise<Todo> => {
    const { data } = await api.put<Todo>(`/todos/${id}`, todo)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`)
  },

  reorder: async (reorderDto: ReorderTodosDto): Promise<void> => {
    await api.put('/todos/reorder', reorderDto)
  },
}

export default api

