import React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`w-5 h-5 rounded border-princess-300 dark:border-slate-600 text-princess-600 focus:ring-princess-500 focus:ring-2 ${className}`}
        {...props}
      />
      {label && (
        <span className="text-princess-700 dark:text-princess-200">{label}</span>
      )}
    </label>
  )
}

