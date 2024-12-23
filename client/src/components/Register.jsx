import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/home');
      return;
    }
  }, [navigate]);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Confirm Password is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
      });

      if (response.status === 201) {
        navigate('/');
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred during registration.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-3">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 col-lg-5" style={{ backgroundColor: '#ced2db', padding: '20px', borderRadius: '8px' }}>
          <h2 className="text-center" style={{ fontSize: '2rem', fontFamily: 'Arial, sans-serif', color: '#007bff' }}>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label style={{ fontSize: '1.1rem' }}>Email:</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ fontSize: '1.1rem' }}>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ fontSize: '1.1rem' }}>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-danger text-center" style={{ fontSize: '1.2rem' }}>{error}</p>}
            <button type="submit" className="btn btn-success d-block mx-auto">
              Submit
            </button>
          </form>
          <div className="mt-3 text-center" style={{ fontSize: '1rem' }}>
            <p className="text-muted">
              If you already have an account, please <a href="/">login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
