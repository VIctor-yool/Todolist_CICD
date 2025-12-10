'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'

interface Goal {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

interface GoalFormProps {
  onClose: () => void
  onAdd: (text: string) => void
  initialGoal?: Goal
}

export const GoalForm: React.FC<GoalFormProps> = ({ onClose, onAdd, initialGoal }) => {
  const [text, setText] = useState(initialGoal?.text || '')
  const isEditMode = !!initialGoal

  useEffect(() => {
    if (initialGoal) {
      setText(initialGoal.text)
    }
  }, [initialGoal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    onAdd(text.trim())
    if (!isEditMode) {
      setText('')
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-princess-700 dark:text-princess-200 mb-1">
          Goal Text *
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-princess-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-princess-900 dark:text-princess-50 focus:outline-none focus:ring-2 focus:ring-princess-500"
          placeholder="Enter goal text"
          required
          autoFocus
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{isEditMode ? 'Update Goal' : 'Add Goal'}</Button>
      </div>
    </form>
  )
}

