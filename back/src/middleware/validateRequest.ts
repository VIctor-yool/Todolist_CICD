import { Request, Response, NextFunction } from 'express'

export const validateCreateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' })
  }

  next()
}

export const validateUpdateTodo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' })
  }

  next()
}

export const validateReorderTodos = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoIds } = req.body

  if (!Array.isArray(todoIds) || todoIds.length === 0) {
    return res.status(400).json({ error: 'todoIds must be a non-empty array' })
  }

  next()
}

