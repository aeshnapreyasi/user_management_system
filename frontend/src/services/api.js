// api.js

const BASE_URL = "http://localhost:5000/api/auth"; // Replace with your backend URL

// Function to register a user
export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to register");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

// Function to log in a user
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to log in");
    }

    return await response.json(); // Should include token
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

// Function to fetch user data
export async function fetchUserData(token) {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
}

// Function to save a note
export async function saveNote(token, noteContent) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ content: noteContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save note");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving note:", error.message);
    throw error;
  }
}

// Function to delete a note
export async function deleteNote(token, noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete note");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting note:", error.message);
    throw error;
  }
}
