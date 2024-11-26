const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Database connection
const authenticateToken = require('../middlewares/authMiddleware'); // Middleware to verify JWT

/**
 * Get all notes for the logged-in user
 */
router.get('/', authenticateToken, (req, res) => {
  const userEmail = req.user.email;

  const query = 'SELECT notes_id, notes FROM notes WHERE email = ?';
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ notes: results });
  });
});

/**
 * Add a new note for the logged-in user
 */
router.post('/', authenticateToken, (req, res) => {
  const { note } = req.body;
  const userEmail = req.user.email;

  if (!note || note.trim() === '') {
    return res.status(400).json({ message: 'Note content is required' });
  }

  const query = 'INSERT INTO notes (notes, email) VALUES (?, ?)';
  db.query(query, [note, userEmail], (err, result) => {
    if (err) {
      console.error('Error adding note:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Note added successfully', noteId: result.insertId });
  });
});

/**
 * Update an existing note
 */
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const userEmail = req.user.email;

  if (!note || note.trim() === '') {
    return res.status(400).json({ message: 'Note content is required' });
  }

  const query = 'UPDATE notes SET notes = ? WHERE notes_id = ? AND email = ?';
  db.query(query, [note, id, userEmail], (err, result) => {
    if (err) {
      console.error('Error updating note:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Note updated successfully' });
  });
});

/**
 * Delete a note
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  const query = 'DELETE FROM notes WHERE notes_id = ? AND email = ?';
  db.query(query, [id, userEmail], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found or unauthorized access' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;
