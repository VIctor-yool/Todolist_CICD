'use client'

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Modal } from './ui/Modal'
import { GoalForm } from './GoalForm'
import { useToastStore } from '@/store/toastStore'

interface Goal {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

interface WeeklyGoalsProps {
  weekKey: string // Format: YYYY-WW (e.g., "2024-51")
}

const MAX_VISIBLE_GOALS = 3

export const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({ weekKey }) => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Load goals for this week from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`weekly-goals-${weekKey}`)
    if (stored) {
      const parsedGoals = JSON.parse(stored)
      // Migrate old goals without createdAt/updatedAt
      const migratedGoals = parsedGoals.map((goal: Goal) => ({
        ...goal,
        createdAt: goal.createdAt || new Date().toISOString(),
        updatedAt: goal.updatedAt || goal.createdAt || new Date().toISOString(),
      }))
      setGoals(migratedGoals)
    } else {
      setGoals([])
    }
  }, [weekKey])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0 || localStorage.getItem(`weekly-goals-${weekKey}`)) {
      localStorage.setItem(`weekly-goals-${weekKey}`, JSON.stringify(goals))
    }
  }, [goals, weekKey])

  const { showToast } = useToastStore()

  const handleAddGoal = (text: string) => {
    const now = new Date().toISOString()
    setGoals([...goals, { id: Date.now().toString(), text, createdAt: now, updatedAt: now }])
    showToast('Goal added successfully!', 'success')
  }

  const handleUpdateGoal = (id: string, text: string) => {
    setGoals(goals.map((g) => 
      g.id === id ? { ...g, text, updatedAt: new Date().toISOString() } : g
    ))
    showToast('Goal updated successfully!', 'success')
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id))
    showToast('Goal deleted successfully!', 'success')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-princess-200 dark:border-slate-700 p-4 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👋</span>
          <h2 className="text-lg font-bold text-princess-900 dark:text-princess-50">
            Weekly Goal
          </h2>
        </div>
      </div>

      {(() => {
        const visibleGoals = goals.slice(0, MAX_VISIBLE_GOALS)
        const remainingCount = goals.length - MAX_VISIBLE_GOALS

        return (
          <div className="space-y-2 mb-4 h-[120px] overflow-hidden relative">
            {goals.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-princess-500">
                No goals
              </p>
            ) : (
              <>
                {visibleGoals.map((goal, index) => (
                  <div key={goal.id} className="flex items-center gap-2 group p-1.5 rounded hover:bg-gray-50 dark:hover:bg-princess-800/50 transition-colors">
                    <span className="text-princess-600 dark:text-princess-400 font-medium text-sm flex-shrink-0">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-princess-700 dark:text-princess-200 truncate">{goal.text}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingGoal(goal)
                          setIsEditModalOpen(true)
                        }}
                        className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-sm flex-shrink-0"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-sm flex-shrink-0"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="flex items-center justify-center p-1.5 w-full hover:bg-gray-50 dark:hover:bg-princess-800/50 rounded transition-colors"
                  >
                    <span className="text-sm text-princess-600 dark:text-princess-400 font-medium cursor-pointer">
                      +{remainingCount} more
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        )
      })()}

      {/* Add New Goal Button */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-1/2 px-2 py-1.5 bg-gray-100 dark:bg-slate-700 text-princess-900 dark:text-princess-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
        >
          + New Goal
        </button>
        {goals.length > 0 && (
          <button
            onClick={() => setIsViewModalOpen(true)}
            className="text-xs text-princess-500 dark:text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors cursor-pointer"
          >
            {goals.length <= MAX_VISIBLE_GOALS
              ? `${goals.length} goal${goals.length !== 1 ? 's' : ''}`
              : `+${goals.length - MAX_VISIBLE_GOALS} more`}
          </button>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Goal"
      >
        <GoalForm
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddGoal}
        />
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingGoal(null)
        }}
        title="Edit Goal"
      >
        {editingGoal && (
          <GoalForm
            onClose={() => {
              setIsEditModalOpen(false)
              setEditingGoal(null)
            }}
            onAdd={(text) => {
              handleUpdateGoal(editingGoal.id, text)
              setIsEditModalOpen(false)
              setEditingGoal(null)
            }}
            initialGoal={editingGoal}
          />
        )}
      </Modal>

      {/* All Goals Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Weekly Goals"
      >
        <div className="space-y-3">
          {goals.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-princess-500 text-center py-4">
              No goals
            </p>
          ) : (
            goals.map((goal, index) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-princess-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-princess-800/50 transition-colors group"
              >
                <span className="text-princess-600 dark:text-princess-400 font-medium text-sm flex-shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-princess-900 dark:text-princess-100">
                    {goal.text}
                  </p>
                  <div className="text-xs text-gray-400 dark:text-princess-500 mt-1 space-y-0.5">
                    {goal.createdAt && (
                      <p>
                        Created: {dayjs(goal.createdAt).format('YYYY-MM-DD HH:mm')}
                      </p>
                    )}
                    {goal.updatedAt && goal.createdAt && goal.updatedAt !== goal.createdAt && (
                      <p>
                        Updated: {dayjs(goal.updatedAt).format('YYYY-MM-DD HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false)
                      setEditingGoal(goal)
                      setIsEditModalOpen(true)
                    }}
                    className="text-princess-400 hover:text-princess-600 dark:hover:text-princess-300 transition-colors text-xl flex-shrink-0"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
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
    </div>
  )
}

