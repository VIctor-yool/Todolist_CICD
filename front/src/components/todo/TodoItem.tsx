'use client'

import React, { useState, useEffect } from 'react'
import type { Todo } from '@/types/todo'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { SubtaskList } from './SubtaskList'
import { useTodoStore } from '@/store/todoStore'

interface TodoItemProps {
  todo: Todo
  isDragging?: boolean
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isDragging = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const { updateTodo, deleteTodo } = useTodoStore()

  // Sync edit state when todo changes
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title)
      setEditDescription(todo.description || '')
    }
  }, [todo.title, todo.description, isEditing])

  const handleToggle = async () => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed })
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleSave = async () => {
    // Close edit mode immediately (optimistic update will handle the update)
    setIsEditing(false)
    
    // Update todo asynchronously (optimistic update is applied immediately in the store)
    try {
      await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      })
    } catch (error) {
      console.error('Failed to update todo:', error)
      // Even if there's an error, the edit mode is already closed
      // The optimistic update will keep the changes
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo.id)
      } catch (error) {
        console.error('Failed to delete todo:', error)
      }
    }
  }

  const handleSubtaskToggle = async (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks?.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    try {
      await updateTodo(todo.id, { subtasks: updatedSubtasks })
    } catch (error) {
      console.error('Failed to toggle subtask:', error)
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg p-4 border border-princess-200 dark:border-slate-700 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      } ${todo.completed ? 'opacity-75' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500 resize-none"
            placeholder="Description (optional)"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">Save</Button>
            <Button onClick={handleCancel} variant="ghost" size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <Checkbox
              checked={todo.completed}
              onChange={handleToggle}
              className="mt-1"
            />
            <div className="flex-1">
              <h3
                className={`text-lg font-medium ${
                  todo.completed
                    ? 'line-through text-princess-400 dark:text-princess-600'
                    : 'text-princess-900 dark:text-princess-50'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="mt-1 text-sm text-princess-600 dark:text-princess-400">
                  {todo.description}
                </p>
              )}
              {todo.date && (
                <p className="mt-1 text-xs text-princess-500 dark:text-princess-500">
                  {new Date(todo.date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
          {todo.subtasks && todo.subtasks.length > 0 && (
            <SubtaskList
              subtasks={todo.subtasks}
              onToggle={handleSubtaskToggle}
            />
          )}
        </>
      )}
    </div>
  )
}

