'use client'

import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import type { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { useTodoStore } from '@/store/todoStore'

export const TodoList: React.FC = () => {
  const { getFilteredTodos, reorderTodos } = useTodoStore()
  const todos = getFilteredTodos()

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const todoIds = items.map((todo) => todo.id)
    try {
      await reorderTodos(todoIds)
    } catch (error) {
      console.error('Failed to reorder todos:', error)
    }
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-princess-500 dark:text-princess-400">
        <p className="text-lg">No todos yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 ${
              snapshot.isDraggingOver ? 'bg-princess-50 dark:bg-slate-800 rounded-lg p-2' : ''
            }`}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem todo={todo} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

