'use client'

import { useEffect, useState } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { useToastStore } from '@/store/toastStore'
import { WeeklyPlanner } from '@/components/WeeklyPlanner'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TodoForm } from '@/components/todo/TodoForm'
import { Modal } from '@/components/ui/Modal'
import { WeeklyPlannerSkeleton } from '@/components/ui/LoadingSkeleton'
import { ToastContainer } from '@/components/ui/Toast'

export default function Home() {
  const { fetchTodos, isLoading } = useTodoStore()
  const { toasts, removeToast } = useToastStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | undefined>()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <div className="min-h-screen w-full bg-princess-50 dark:bg-slate-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-princess-900 dark:text-princess-50">
              Weekly Planner & To-do list
            </h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div>
          {isLoading ? (
            <WeeklyPlannerSkeleton />
          ) : (
            <WeeklyPlanner
              onAddTodo={(date) => {
                setSelectedDate(date)
                setIsModalOpen(true)
              }}
            />
          )}
        </div>
      </div>

      {/* Create Todo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDate(undefined)
        }}
        title="Create New Todo"
      >
        <TodoForm
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDate(undefined)
          }}
          initialDate={selectedDate}
        />
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
