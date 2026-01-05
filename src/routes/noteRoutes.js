const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

/**
 * All note routes require authentication
 * Apply auth middleware to all routes
 */
router.use(authenticateToken);

/**
 * POST /api/notes
 * Create a new note
 */
router.post("/", createNote);

/**
 * GET /api/notes
 * Get all notes owned by authenticated user
 */
router.get("/", getNotes);

/**
 * GET /api/notes/:id
 * Get a single note by ID (only if owned by authenticated user)
 */
router.get("/:id", getNoteById);

/**
 * PUT /api/notes/:id
 * Update a note (only if owned by authenticated user)
 */
router.put("/:id", updateNote);

/**
 * DELETE /api/notes/:id
 * Delete a note (only if owned by authenticated user)
 */
router.delete("/:id", deleteNote);

module.exports = router;

