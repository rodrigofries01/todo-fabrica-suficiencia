const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'replace_this_with_a_secret';
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    stmt.run([name || null, email, hashed], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ message: 'Email already registered' });
        return res.status(500).json({ message: err.message });
      }
      const token = jwt.sign({ id: this.lastID }, SECRET, { expiresIn: '7d' });
      res.json({ token });
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });
    res.json({ token });
  });
});

module.exports = router;
