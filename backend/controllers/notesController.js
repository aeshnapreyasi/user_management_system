const Notes = require('../models/Notes'); // Import the Notes model

// Create a new note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;  // Assuming JWT token is used for authentication

  if (!title || !content) {
    return res.status(400).json({ error: 'Please provide both title and content' });
  }

  try {
    // Create a new note in the database
    const newNote = {
      title,
      content,
      user_id: userId,  // Link note to the current user
    };

    const result = await Notes.create(newNote);
    res.status(201).json({ message: 'Note created successfully!', noteId: result.insertId });
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all notes for the authenticated user
const getNotes = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Fetch notes for the logged-in user
    const notes = await Notes.findByUserId(userId);
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get a specific note by ID
const getNoteById = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;

  try {
    // Fetch a single note by ID for the authenticated user
    const note = await Notes.findById(noteId, userId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (err) {
    console.error('Error fetching note by ID:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update a specific note by ID
const updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user.userId;

  if (!title || !content) {
    return res.status(400).json({ error: 'Please provide both title and content' });
  }

  try {
    // Check if the note exists and belongs to the user
    const existingNote = await Notes.findById(noteId, userId);
    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found or not owned by the user' });
    }

    // Update the note in the database
    const updatedNote = {
      title,
      content,
    };

    await Notes.update(noteId, updatedNote);
    res.status(200).json({ message: 'Note updated successfully' });
  } catch (err) {
    console.error('Error updating note:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;

  try {
    // Check if the note exists and belongs to the user
    const existingNote = await Notes.findById(noteId, userId);
    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found or not owned by the user' });
    }

    // Delete the note from the database
    await Notes.delete(noteId);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
