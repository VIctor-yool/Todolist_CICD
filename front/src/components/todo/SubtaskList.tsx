import React from 'react'
import type { Subtask } from '@/types/todo'
import { Checkbox } from '../ui/Checkbox'

interface SubtaskListProps {
  subtasks: Subtask[]
  onToggle: (id: string) => void
  className?: string
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onToggle,
  className = '',
}) => {
  if (!subtasks || subtasks.length === 0) return null

  return (
    <div className={`mt-2 space-y-1 ${className}`}>
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2 pl-4">
          <Checkbox
            checked={subtask.completed}
            onChange={() => onToggle(subtask.id)}
            label={subtask.title}
            className="text-sm"
          />
        </div>
      ))}
    </div>
  )
}

