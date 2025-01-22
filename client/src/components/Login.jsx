import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/home");
      return;
    }
  }, [navigate]);

  const validateForm = () => {
    let valid = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return; // Stop if form validation fails
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/`, {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "An error occurred during login."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-3">
      <div
        className="row justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div
          className="col-md-6 col-lg-5"
          style={{
            backgroundColor: "#ced2db",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2
            className="text-center"
            style={{
              fontSize: "3rem",
              fontFamily: "Arial, sans-serif",
              color: "#007bff",
            }}
          >
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label style={{ fontSize: "1.1rem" }}>Email:</label>
              <input
                type="text"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
            </div>
            <div className="form-group mb-3">
              <label style={{ fontSize: "1.1rem" }}>Password:</label>
              <input
                type="password"
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="invalid-feedback">{passwordError}</div>
              )}
            </div>
            {error && (
              <p
                className="text-danger text-center"
                style={{ fontSize: "1.2rem" }}
              >
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-success d-block mx-auto">
              Login
            </button>
          </form>
          <br />
          <p className="text-center" style={{ fontSize: "1rem" }}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
