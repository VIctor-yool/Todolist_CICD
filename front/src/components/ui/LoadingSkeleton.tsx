import React from 'react'

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded ${className}`}
    />
  )
}

export const TodoSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded">
      <Skeleton className="w-5 h-5 rounded" />
      <Skeleton className="h-4 flex-1" />
    </div>
  )
}

export const DayColumnSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-slate-800 flex flex-col h-full">
      <div className="mb-4">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2 mb-4 h-[120px]">
        <TodoSkeleton />
        <TodoSkeleton />
        <TodoSkeleton />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export const WeeklyPlannerSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 relative">
        <Skeleton className="h-6 w-48" />
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="w-0" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DayColumnSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DayColumnSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

