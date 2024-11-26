import React, { useState, useEffect } from "react";
import { fetchNotes, saveNote, deleteNote } from "../services/api";

function Notes() {
  const [note, setNote] = useState("");
  const [notesList, setNotesList] = useState([]);

  // Fetch existing notes when component mounts
  useEffect(() => {
    fetchNotesFromDB();
  }, []);

  // Fetch notes from backend
  const fetchNotesFromDB = async () => {
    try {
      const response = await fetchNotes();
      setNotesList(response.data); // Assuming response is an array of notes
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Handle note input change
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  // Handle note submission
  const handleNoteSubmit = async (event) => {
    event.preventDefault();

    if (note.trim() === "") {
      alert("Note cannot be empty!");
      return;
    }

    try {
      await saveNote({ note }); // Save the note
      setNote(""); // Clear the input field
      fetchNotesFromDB(); // Refresh the notes list
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Handle note deletion
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId); // Delete note by ID
      fetchNotesFromDB(); // Refresh the notes list
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="notes-container">
      <h2>Your Notes</h2>

      {/* Notes Form */}
      <form onSubmit={handleNoteSubmit} className="notes-form">
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Write your note here..."
          rows="4"
        />
        <button type="submit">Save Note</button>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notesList.length === 0 ? (
          <p>No notes available</p>
        ) : (
          notesList.map((noteItem) => (
            <div key={noteItem.id} className="note-item">
              <p>{noteItem.note}</p>
              <button onClick={() => handleDeleteNote(noteItem.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
