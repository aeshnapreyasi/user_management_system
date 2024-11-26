import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

const Home = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModified, setIsModified] = useState(false); // Tracks if fields are modified

  const BASE_URL = "http://localhost:5000/api";

  // Fetch user details and notes on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${BASE_URL}/users/profile`, {
          withCredentials: true,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}` // Ensure the token is in localStorage
          }
  
        });
        
        setUserDetails(userResponse.data); // Populate fields

        const notesResponse = await axios.get(`${BASE_URL}/notes`, {
          withCredentials: true,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}` // Ensure the token is in localStorage
          }
        });

        setNotes(notesResponse.data); // Populate notes
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Handle input change for user profile update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
    setIsModified(true); // Mark fields as modified
  };

  // Update user profile
  const handleUpdateProfile = async () => {
    if (!isModified) {
      alert("No changes to update!");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/user`, userDetails, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      setIsModified(false); // Reset modification state
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  };

  // Add a new note
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert("Note cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/notes`,
        { note: newNote },
        { withCredentials: true }
      );
      setNotes((prevNotes) => [...prevNotes, response.data]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
      setErrorMessage("Failed to add note. Please try again.");
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notes/${id}`, { withCredentials: true });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      setErrorMessage("Failed to delete note. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("userToken");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to User Management System</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="profile-section">
        <h2>Profile Details</h2>
        <form className="profile-form">
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={userDetails.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={userDetails.lastName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Mobile:
            <input
              type="tel"
              name="mobile"
              value={userDetails.mobile}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={userDetails.password}
              onChange={handleInputChange}
            />
          </label>
          <button
            type="button"
            onClick={handleUpdateProfile}
            disabled={!isModified} // Disable button if no changes
          >
            Update Profile
          </button>
        </form>
      </div>

      <div className="notes-section">
        <h2>Your Notes</h2>
        <div className="add-note">
          <textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          ></textarea>
          <button onClick={handleAddNote}>Save Note</button>
        </div>
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id}>
              <p>{note.note}</p>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
