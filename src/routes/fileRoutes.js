const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");
const { uploadFile, getFiles } = require("../controllers/fileController");

/**
 * All file routes require authentication
 * Apply auth middleware to all routes
 */
router.use(authenticateToken);

/**
 * POST /api/files
 * Upload a file
 * Uses multer middleware for file handling
 */
router.post("/", upload.single("file"), uploadFile);

/**
 * GET /api/files
 * Get all files uploaded by authenticated user
 */
router.get("/", getFiles);

module.exports = router;

