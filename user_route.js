const express = require('express');
const authMiddleware = require('../middlewares/auth.js');

const router = express.Router();

// Protected route - requires valid JWT token
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Profile accessed successfully', 
        user: req.user 
    });
});

module.exports = router;