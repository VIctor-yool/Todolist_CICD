'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { useTodoStore } from '@/store/todoStore'
import dayjs from 'dayjs'
import type { Todo } from '@/types/todo'

interface TodoFormProps {
  onClose: () => void
  initialDate?: string
  initialTodo?: Todo // For edit mode
}

export const TodoForm: React.FC<TodoFormProps> = ({ onClose, initialDate, initialTodo }) => {
  const [title, setTitle] = useState(initialTodo?.title || '')
  const [description, setDescription] = useState(initialTodo?.description || '')
  const [date, setDate] = useState(initialTodo?.date || initialDate || dayjs().format('YYYY-MM-DD'))
  const { createTodo, updateTodo } = useTodoStore()

  const isEditMode = !!initialTodo

  // Update form when initialTodo or initialDate changes
  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title)
      setDescription(initialTodo.description || '')
      setDate(initialTodo.date || dayjs().format('YYYY-MM-DD'))
    } else if (initialDate) {
      setDate(initialDate)
    }
  }, [initialTodo, initialDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Close modal immediately (before async operation)
    onClose()

    if (isEditMode && initialTodo) {
      // Update existing todo
      const updates = {
        title: title.trim(),
        description: description.trim() || undefined,
        date: date || undefined,
      }
      updateTodo(initialTodo.id, updates).catch((error) => {
        console.error('Failed to update todo:', error)
      })
    } else {
      // Create new todo
      const todoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        date: date || undefined,
      }
      createTodo(todoData).catch((error) => {
        console.error('Failed to create todo:', error)
      })
    }

    // Reset form
    if (!isEditMode) {
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-princess-700 dark:text-princess-200 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500"
          placeholder="Enter todo title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-princess-700 dark:text-princess-200 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500 resize-none"
          placeholder="Enter description (optional)"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-princess-700 dark:text-princess-200 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{isEditMode ? 'Update Todo' : 'Create Todo'}</Button>
      </div>
    </form>
  )
}

