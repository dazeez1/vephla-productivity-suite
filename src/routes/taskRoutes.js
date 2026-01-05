const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

/**
 * All task routes require authentication
 * Apply auth middleware to all routes
 */
router.use(authenticateToken);

/**
 * POST /api/tasks
 * Create a new task
 */
router.post("/", createTask);

/**
 * GET /api/tasks
 * Get all tasks assigned to authenticated user
 */
router.get("/", getTasks);

/**
 * GET /api/tasks/:id
 * Get a single task by ID (only if assigned to or created by authenticated user)
 */
router.get("/:id", getTaskById);

/**
 * PUT /api/tasks/:id
 * Update a task (only creator can update)
 */
router.put("/:id", updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete a task (only creator can delete)
 */
router.delete("/:id", deleteTask);

module.exports = router;

