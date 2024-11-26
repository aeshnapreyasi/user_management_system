import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import '../styles.css'; // Ensure you have styles defined for login components

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL if hosted
  //const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

//  const [ setSuccessMessage] = useState(''); // To display success message after registration

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
        withCredentials: true,
      });
      // Redirect user on successful login
      if (response.status === 200) {
        // Store the user token in localStorage
        localStorage.setItem('userToken', response.data.token); // Assuming the token is in response.data.token
        window.location.reload(); // This refreshes the entire page to reflect changes
              
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="login-form" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>

      <div className="register-redirect">
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
