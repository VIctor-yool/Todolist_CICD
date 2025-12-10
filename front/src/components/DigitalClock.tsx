'use client'

import React from 'react'
import { useClock } from '@/hooks/useClock'

export const DigitalClock: React.FC = () => {
  const time = useClock()

  return (
    <div className="font-mono text-2xl font-bold text-princess-700 dark:text-princess-200">
      {time}
    </div>
  )
}

