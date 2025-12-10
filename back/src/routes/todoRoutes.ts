import { Router } from 'express'
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
} from '../controllers/todoController'
import {
  validateCreateTodo,
  validateUpdateTodo,
  validateReorderTodos,
} from '../middleware/validateRequest'

const router = Router()

router.get('/', getAllTodos)
router.get('/:id', validateUpdateTodo, getTodoById)
router.post('/', validateCreateTodo, createTodo)
router.put('/:id', validateUpdateTodo, updateTodo)
router.delete('/:id', validateUpdateTodo, deleteTodo)
router.put('/reorder', validateReorderTodos, reorderTodos)

export default router

