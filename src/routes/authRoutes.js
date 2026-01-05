const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", registerUser);

/**
 * POST /api/auth/login
 * Login user and receive JWT token
 */
router.post("/login", loginUser);

module.exports = router;

