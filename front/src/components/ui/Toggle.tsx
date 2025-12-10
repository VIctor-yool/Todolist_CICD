import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-14 h-8 rounded-full transition-colors duration-200 ${
            checked
              ? 'bg-princess-600 dark:bg-princess-500'
              : 'bg-princess-300 dark:bg-slate-700'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
              checked ? 'transform translate-x-6' : ''
            }`}
          />
        </div>
      </div>
      {label && (
        <span className="text-princess-700 dark:text-princess-200">{label}</span>
      )}
    </label>
  )
}

