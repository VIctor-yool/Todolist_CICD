import { create } from 'zustand'
import type { Todo, CreateTodoDto, Subtask } from '@/types/todo'
import { todoApi } from '@/lib/api'
import { useToastStore } from './toastStore'

interface TodoStore {
  todos: Todo[]
  selectedDate: string | null
  isLoading: boolean
  error: string | null
  deletedTodoIds: Set<string> // Track deleted todo IDs to prevent them from reappearing
  
  // Actions
  setTodos: (todos: Todo[]) => void
  setSelectedDate: (date: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Optimistic updates
  addTodoOptimistic: (todo: Todo) => void
  updateTodoOptimistic: (id: string, updates: Partial<Todo>) => void
  deleteTodoOptimistic: (id: string) => void
  reorderTodosOptimistic: (todoIds: string[]) => void
  
  // API calls
  fetchTodos: () => Promise<void>
  createTodo: (todo: CreateTodoDto) => Promise<void>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  reorderTodos: (todoIds: string[]) => Promise<void>
  
  // Computed
  getFilteredTodos: () => Todo[]
  getTodosByDate: (date: string) => Todo[]
  getTodoCountByDate: (date: string) => number
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  selectedDate: null,
  isLoading: false,
  error: null,
  deletedTodoIds: new Set<string>(),

  setTodos: (todos) => set({ todos }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addTodoOptimistic: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo].sort((a, b) => a.order - b.order),
    })),

  updateTodoOptimistic: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    })),

  deleteTodoOptimistic: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
      deletedTodoIds: new Set([...state.deletedTodoIds, id]),
    })),

  reorderTodosOptimistic: (todoIds) =>
    set((state) => {
      const todoMap = new Map(state.todos.map((t) => [t.id, t]))
      const reordered = todoIds
        .map((id, index) => {
          const todo = todoMap.get(id)
          return todo ? { ...todo, order: index } : null
        })
        .filter((t): t is Todo => t !== null)
      const remaining = state.todos.filter((t) => !todoIds.includes(t.id))
      return { todos: [...reordered, ...remaining].sort((a, b) => a.order - b.order) }
    }),

  fetchTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      const serverTodos = await todoApi.getAll()
      // Merge server todos with local temp todos (keep temp todos that don't exist on server)
      set((state) => {
        const tempTodos = state.todos.filter((t) => t.id.startsWith('temp-'))
        const serverTodoIds = new Set(serverTodos.map((t) => t.id))
        // Keep temp todos that haven't been synced to server yet
        const unsyncedTempTodos = tempTodos.filter((t) => !serverTodoIds.has(t.id))
        // Exclude todos that were deleted locally
        const filteredServerTodos = serverTodos.filter(
          (serverTodo) => !state.deletedTodoIds.has(serverTodo.id)
        )
        // Combine server todos (excluding deleted ones) with unsynced temp todos
        const mergedTodos = [...filteredServerTodos, ...unsyncedTempTodos].sort((a, b) => a.order - b.order)
        return { todos: mergedTodos, isLoading: false }
      })
    } catch (error) {
      // If fetch fails, keep existing todos (including temp ones)
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch todos',
        isLoading: false,
      })
    }
  },

  createTodo: async (todoData) => {
    const tempId = `temp-${Date.now()}`
    const now = new Date().toISOString()
    
    // Convert subtasks from CreateTodoDto format to Subtask format
    const subtasks: Subtask[] | undefined = todoData.subtasks?.map((st, index) => ({
      ...st,
      id: `temp-subtask-${Date.now()}-${index}`,
      createdAt: now,
      updatedAt: now,
    }))
    
    const newTodo: Todo = {
      ...todoData,
      completed: false,
      id: tempId,
      order: get().todos.length,
      createdAt: now,
      updatedAt: now,
      subtasks,
    }
    
    get().addTodoOptimistic(newTodo)
    
    // 즉시 토스트 표시 (optimistic update 직후)
    useToastStore.getState().showToast('Todo created successfully!', 'success')
    
    try {
      const created = await todoApi.create(todoData)
      // Replace temp todo with server response
      set((state) => ({
        todos: state.todos.map((t) => (t.id === tempId ? created : t)),
      }))
      // 성공 시에는 이미 토스트가 표시되었으므로 추가 토스트 불필요
    } catch (error) {
      // If API fails, keep the optimistic todo instead of deleting it
      // This allows the app to work even without a backend
      console.warn('Failed to create todo on server, keeping local version:', error)
      // 실패해도 optimistic update는 유지되므로 토스트는 이미 표시됨
    }
  },

  updateTodo: async (id, updates) => {
    const original = get().todos.find((t) => t.id === id)
    if (!original) return

    get().updateTodoOptimistic(id, updates)

    // 즉시 토스트 표시 (optimistic update 직후)
    useToastStore.getState().showToast('Todo updated successfully!', 'success')

    try {
      const updated = await todoApi.update(id, updates)
      // Replace the entire todo with the server response
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? updated : todo
        ),
      }))
      // 성공 시에는 이미 토스트가 표시되었으므로 추가 토스트 불필요
    } catch (error) {
      // If API fails, keep the optimistic update instead of rolling back
      // This allows the app to work even without a backend
      console.warn('Failed to update todo on server, keeping local update:', error)
      // 실패해도 optimistic update는 유지되므로 토스트는 이미 표시됨
    }
  },

  deleteTodo: async (id) => {
    const original = get().todos.find((t) => t.id === id)
    if (!original) return

    get().deleteTodoOptimistic(id)

    // 즉시 토스트 표시 (optimistic update 직후)
    useToastStore.getState().showToast('Todo deleted successfully!', 'success')

    try {
      await todoApi.delete(id)
      // 성공 시에는 이미 토스트가 표시되었으므로 추가 토스트 불필요
    } catch (error) {
      // If API fails, keep the todo deleted (don't restore it)
      // This allows the app to work even without a backend
      console.warn('Failed to delete todo on server, keeping local deletion:', error)
      // 실패해도 optimistic update는 유지되므로 토스트는 이미 표시됨
    }
  },

  reorderTodos: async (todoIds) => {
    const original = [...get().todos]

    get().reorderTodosOptimistic(todoIds)

    try {
      await todoApi.reorder({ todoIds })
    } catch (error) {
      set({ todos: original })
      throw error
    }
  },

  getFilteredTodos: () => {
    const { todos, selectedDate } = get()
    if (!selectedDate) return todos.sort((a, b) => a.order - b.order)
    return todos
      .filter((todo) => todo.date === selectedDate)
      .sort((a, b) => a.order - b.order)
  },

  getTodosByDate: (date) => {
    return get().todos
      .filter((todo) => todo.date === date)
      .sort((a, b) => a.order - b.order)
  },

  getTodoCountByDate: (date) => {
    return get().todos.filter((todo) => todo.date === date).length
  },
}))

