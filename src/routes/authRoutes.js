const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", registerUser);

module.exports = router;

