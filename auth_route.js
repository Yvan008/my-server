const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db.js');

const router = express.Router();

router.post('/register', async(req, res) => {
  const { username, password, role, department, active } = req.body;

  if (!username || !password || !role || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, role, department, active, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

    db.query(query, [username, hashedPassword, role, department, active || 1], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  });
});

router.post('/login', async (req,res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?', [username],
        async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if(results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role,
            department: user.department
        },
        'your_jwt_secret',
        { expiresIn: '1h' }
        );
        
        res.status(200).json({ message: 'Login successful', user, token });
    
    });
});

module.exports = router;