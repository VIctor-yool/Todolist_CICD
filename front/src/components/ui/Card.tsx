import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-princess-200 dark:border-slate-700 p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-princess-300 dark:hover:border-princess-700' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

