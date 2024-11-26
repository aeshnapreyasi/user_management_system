import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  // To show loading spinner
  const [successMessage, setSuccessMessage] = useState(''); // To display success message after registration

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = 'First name is required';
    if (!formData.lastName) formErrors.lastName = 'Last name is required';
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email address is invalid';
    }
    if (!formData.mobile) {
      formErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      formErrors.mobile = 'Mobile number should be 10 digits';
    }
    if (!formData.password) formErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      formErrors.password = 'Password must be at least 6 characters long';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Start loading spinner
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);

        if (response.status === 201) {
          // Show success message
          setSuccessMessage('Registration successful! Redirecting to login...');
          // Redirect to login page after successful registration
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Wait for 2 seconds before navigating
        }
      } catch (error) {
        // Handle error
        if (error.response && error.response.data) {
          alert(error.response.data.message || 'Registration failed');
        } else {
          alert('Something went wrong. Please try again later.');
        }
      } finally {
        setLoading(false);  // Stop loading spinner
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {successMessage && <p className="success-text">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          {errors.mobile && <p className="error-text">{errors.mobile}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Navigation Link to Login Page */}
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
