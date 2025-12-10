'use client'

import React, { useState } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useTodoStore } from '@/store/todoStore'
import { Checkbox } from './ui/Checkbox'
import { Modal } from './ui/Modal'
import { TodoForm } from './todo/TodoForm'
import type { Todo } from '@/types/todo'

const MAX_VISIBLE_TODOS = 3

interface DayColumnProps {
  day: Dayjs
  dateStr: string
  isToday: boolean
  isSelected: boolean
  dayColor: string
  onAddTodo: () => void
  onSelect: () => void
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  dateStr,
  isToday,
  isSelected,
  dayColor,
  onAddTodo,
  onSelect,
}) => {
  const { getTodosByDate, updateTodo, deleteTodo } = useTodoStore()
  const todos = getTodosByDate(dateStr)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dayName = dayNames[day.day() === 0 ? 6 : day.day() - 1] || day.format('dddd')

  return (
    <div
      className={`rounded-lg border p-4 bg-white dark:bg-slate-800 transition-all duration-200 flex flex-col h-full ${
        isSelected
          ? 'ring-2 ring-princess-500 ring-offset-2'
          : ''
      }`}
    >
      {/* Day Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-bold text-lg ${
              isToday
                ? 'text-princess-700 dark:text-princess-300'
                : 'text-princess-900 dark:text-princess-100'
            }`}
          >
            {dayName}
          </h3>
          {isToday && (
            <span className="text-sm text-princess-600 dark:text-princess-400 font-medium">
              Today
            </span>
          )}
        </div>
        <p className="text-base text-princess-600 dark:text-princess-400">
          {day.format('MMM D')}
        </p>
      </div>

      {/* Todos List */}
      {(() => {
        const visibleTodos = todos.slice(0, MAX_VISIBLE_TODOS)
        const remainingCount = todos.length - MAX_VISIBLE_TODOS

        return (
          <div className="space-y-2 mb-4 h-[120px] overflow-hidden relative">
            {todos.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-princess-500">
                No tasks
              </p>
            ) : (
              <>
                {visibleTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-princess-800/50 transition-colors group"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onChange={async () => {
                        const { updateTodo } = useTodoStore.getState()
                        await updateTodo(todo.id, { completed: !todo.completed })
                      }}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          todo.completed
                            ? 'line-through text-gray-400 dark:text-princess-600'
                            : 'text-princess-900 dark:text-princess-100'
                        }`}
                      >
                        {todo.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTodo(todo)
                          setIsEditModalOpen(true)
                        }}
                        className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-sm flex-shrink-0"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={async () => {
                          await deleteTodo(todo.id)
                        }}
                        className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-sm flex-shrink-0"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      })()}

      {/* Add New Task Button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onAddTodo}
          className="w-1/2 px-2 py-1.5 bg-gray-100 dark:bg-slate-700 text-princess-900 dark:text-princess-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
        >
          + New Task
        </button>
        {todos.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-princess-500 dark:text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors cursor-pointer"
          >
            {todos.length <= MAX_VISIBLE_TODOS
              ? `${todos.length} task${todos.length !== 1 ? 's' : ''}`
              : `+${todos.length - MAX_VISIBLE_TODOS} more`}
          </button>
        )}
      </div>

      {/* All Todos Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${dayName} - ${day.format('MMM D')}`}
      >
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-princess-500 text-center py-4">
              No tasks
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-princess-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-princess-800/50 transition-colors group"
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={async () => {
                    await updateTodo(todo.id, { completed: !todo.completed })
                  }}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-base ${
                      todo.completed
                        ? 'line-through text-gray-400 dark:text-princess-600'
                        : 'text-princess-900 dark:text-princess-100'
                    }`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-sm text-gray-500 dark:text-princess-400 mt-1">
                      {todo.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 dark:text-princess-500 mt-1 space-y-0.5">
                    {todo.createdAt && (
                      <p>
                        Created: {dayjs(todo.createdAt).format('YYYY-MM-DD HH:mm')}
                      </p>
                    )}
                    {todo.updatedAt && todo.createdAt && todo.updatedAt !== todo.createdAt && (
                      <p>
                        Updated: {dayjs(todo.updatedAt).format('YYYY-MM-DD HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingTodo(todo)
                      setIsEditModalOpen(true)
                    }}
                    className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-xl flex-shrink-0"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={async () => {
                      await deleteTodo(todo.id)
                    }}
                    className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-xl flex-shrink-0"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTodo(null)
        }}
        title="Edit Todo"
      >
        {editingTodo && (
          <TodoForm
            onClose={() => {
              setIsEditModalOpen(false)
              setEditingTodo(null)
            }}
            initialTodo={editingTodo}
          />
        )}
      </Modal>
    </div>
  )
}

