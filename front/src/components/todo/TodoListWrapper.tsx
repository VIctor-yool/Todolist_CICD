'use client'

import dynamic from 'next/dynamic'

// react-beautiful-dnd doesn't work well with SSR, so we disable it
const TodoListNoSSR = dynamic(
  () => import('./TodoList').then((mod) => ({ default: mod.TodoList })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-12 text-princess-500 dark:text-princess-400">
        <p>Loading...</p>
      </div>
    ),
  }
)

export default TodoListNoSSR

