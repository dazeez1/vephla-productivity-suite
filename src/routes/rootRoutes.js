const express = require('express');
const router = express.Router();

/**
 * GET / - Root endpoint
 * Returns API status message
 */
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API running' 
  });
});

module.exports = router;

