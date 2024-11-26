const db = require('../config/db');

// Create a new note
const create = (userId, title, content) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
    db.query(query, [userId, title, content], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get all notes for a user
const findAllByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM notes WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Find a note by ID
const findById = (noteId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM notes WHERE id = ?';
    db.query(query, [noteId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Update a note
const update = (noteId, title, content) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, noteId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Delete a note
const deleteNote = (noteId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [noteId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  create,
  findAllByUserId,
  findById,
  update,
  delete: deleteNote,
};
