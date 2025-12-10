'use client'

import React, { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(false)

  useEffect(() => {
    // 3초 후에 부드럽게 사라지기 시작
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // 애니메이션 완료 후 실제로 제거
  const handleTransitionEnd = () => {
    if (isExiting && !shouldRemove) {
      setShouldRemove(true)
      onClose()
    }
  }

  const handleClose = () => {
    setIsExiting(true)
  }

  const bgColors = {
    success: 'bg-blue-500 dark:bg-blue-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  }

  const icons = {
    success: '✓',
    error: '×',
    info: 'ℹ',
  }

  if (shouldRemove) return null

  return (
    <div
      className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md transition-all duration-300 ease-in-out ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-slide-in'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <span className="text-xl font-bold">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  )
}

