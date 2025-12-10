'use client'

import React, { useState } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useTodoStore } from '@/store/todoStore'
import { DayColumn } from './DayColumn'
import { WeeklyGoals } from './WeeklyGoals'

dayjs.extend(isoWeek)

interface WeeklyPlannerProps {
  onAddTodo: (date: string) => void
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ onAddTodo }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs())
  const { selectedDate, setSelectedDate } = useTodoStore()

  const weekStart = currentWeek.startOf('isoWeek')
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'))
  const weekKey = `${weekStart.year()}-${weekStart.isoWeek()}`

  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, 'week'))
  }

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, 'week'))
  }

  const goToCurrentWeek = () => {
    setCurrentWeek(dayjs())
    setSelectedDate(null)
  }

  return (
    <div className="space-y-4">
      {/* Week Date Range and Navigation */}
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-lg font-bold text-princess-900 dark:text-princess-50">
          {weekStart.format('MMM D')} - {weekStart.add(6, 'day').format('MMM D, YYYY')}
        </h2>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-3 py-1.5 bg-princess-100 dark:bg-slate-800 text-princess-700 dark:text-princess-300 rounded-lg hover:bg-princess-200 dark:hover:bg-slate-700 border border-princess-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            ←
          </button>
          <button
            onClick={goToCurrentWeek}
            className="px-3 py-1.5 bg-princess-100 dark:bg-slate-800 text-princess-700 dark:text-princess-300 rounded-lg hover:bg-princess-200 dark:hover:bg-slate-700 border border-princess-200 dark:border-slate-700 transition-colors text-sm shadow-sm"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1.5 bg-princess-100 dark:bg-slate-800 text-princess-700 dark:text-princess-300 rounded-lg hover:bg-princess-200 dark:hover:bg-slate-700 border border-princess-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            →
          </button>
        </div>
        <div className="w-0"></div>
      </div>

      {/* Days Grid - 2 Rows (4 + 4: Fri-Sun + Weekly Goals) */}
      <div className="space-y-4">
        {/* First Row - Monday to Thursday */}
        <div className="grid grid-cols-4 gap-4">
          {weekDays.slice(0, 4).map((day, index) => {
            const dateStr = day.format('YYYY-MM-DD')
            const isToday = dateStr === dayjs().format('YYYY-MM-DD')
            const isSelected = dateStr === selectedDate

            const dayColors = [
              'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
              'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            ]

            return (
              <DayColumn
                key={dateStr}
                day={day}
                dateStr={dateStr}
                isToday={isToday}
                isSelected={isSelected}
                dayColor={dayColors[index]}
                onAddTodo={() => onAddTodo(dateStr)}
                onSelect={() => setSelectedDate(isSelected ? null : dateStr)}
              />
            )
          })}
        </div>
        
        {/* Second Row - Friday to Sunday + Weekly Goals */}
        <div className="grid grid-cols-4 gap-4">
          {weekDays.slice(4, 7).map((day, index) => {
            const dateStr = day.format('YYYY-MM-DD')
            const isToday = dateStr === dayjs().format('YYYY-MM-DD')
            const isSelected = dateStr === selectedDate

            const dayColors = [
              'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
              'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
              'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
            ]

            return (
              <DayColumn
                key={dateStr}
                day={day}
                dateStr={dateStr}
                isToday={isToday}
                isSelected={isSelected}
                dayColor={dayColors[index]}
                onAddTodo={() => onAddTodo(dateStr)}
                onSelect={() => setSelectedDate(isSelected ? null : dateStr)}
              />
            )
          })}
          {/* Weekly Goals in the last position */}
          <WeeklyGoals weekKey={weekKey} />
        </div>
      </div>
    </div>
  )
}

