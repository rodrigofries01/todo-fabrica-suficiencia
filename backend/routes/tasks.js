const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);

router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  const stmt = db.prepare('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)');
  stmt.run([req.userId, title, description || null], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err2, task) => {
      res.status(201).json(task);
    });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, done } = req.body;
  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.userId], (err, task) => {
    if (!task) return res.status(404).json({ message: 'Not found' });
    db.run('UPDATE tasks SET title = ?, description = ?, done = ? WHERE id = ?', [title || task.title, description || task.description, done ? 1 : 0, id], function(err){
      if(err) return res.status(500).json({ message: 'DB error' });
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err2, updated) => res.json(updated));
    });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.userId], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
