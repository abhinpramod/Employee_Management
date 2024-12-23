import React, { useState } from 'react';
import axios from 'axios';

const AddEmployee = ({ token, fetchEmployees, setOpen }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    // Prepare the employee data
    const employee = { name, position, contact };

    try {
      // Make the API call to add the employee
      await axios.post('http://localhost:5000/api/employees', employee, {
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });

      // Fetch updated employee list
      fetchEmployees();

      // Reset error and close modal
      setError('');
      setOpen(false); // Close the modal after adding the employee

      // Clear input fields
      setName('');
      setPosition('');
      setContact('');
    } catch (error) {
      // Handle errors
      setError(error.response?.data?.error || 'Failed to add employee');
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Position:</label>
        <input
          type="text"
          className="form-control"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Contact:</label>
        <input
          type="text"
          className="form-control"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
      <br />
      <button type="submit" className="btn btn-success w-100">Add Employee</button>
    </form>
  );
};

export default AddEmployee;
