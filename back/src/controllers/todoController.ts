import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      include: {
        subtasks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
}

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: {
        subtasks: {
          orderBy: { order: 'asc' },
        },
      },
    })
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, date, subtasks } = req.body

    // Get the current max order
    const maxOrderTodo = await prisma.todo.findFirst({
      orderBy: { order: 'desc' },
    })
    const order = maxOrderTodo ? maxOrderTodo.order + 1 : 0

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        date,
        order,
        subtasks: subtasks
          ? {
              create: subtasks.map((st: any, index: number) => ({
                title: st.title,
                completed: st.completed || false,
                order: st.order ?? index,
              })),
            }
          : undefined,
      },
      include: {
        subtasks: {
          orderBy: { order: 'asc' },
        },
      },
    })
    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, completed, date, subtasks } = req.body

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(date !== undefined && { date }),
        ...(subtasks && {
          subtasks: {
            deleteMany: {},
            create: subtasks.map((st: any, index: number) => ({
              title: st.title,
              completed: st.completed || false,
              order: st.order ?? index,
            })),
          },
        }),
      },
      include: {
        subtasks: {
          orderBy: { order: 'asc' },
        },
      },
    })
    res.json(todo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.todo.delete({
      where: { id },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' })
  }
}

export const reorderTodos = async (req: Request, res: Response) => {
  try {
    const { todoIds } = req.body

    if (!Array.isArray(todoIds)) {
      return res.status(400).json({ error: 'todoIds must be an array' })
    }

    // Update order for each todo
    await Promise.all(
      todoIds.map((id: string, index: number) =>
        prisma.todo.update({
          where: { id },
          data: { order: index },
        })
      )
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder todos' })
  }
}

