// export default EmployeeTable;
import React, { useState } from 'react';
import axios from 'axios';

const EmployeeTable = ({ employees, onDelete, fetchEmployees, token }) => {
  const [editingId, setEditingId] = useState(null); // track the employee being edited
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editContact, setEditContact] = useState('');
  const [error, setError] = useState(null); // handle errors

  // function to handle when the edit button is clicked
  const startEditing = (employee) => {
    console.log(employee);
    
    setEditingId(employee._id);
    setEditName(employee.name);
    setEditPosition(employee.position);
    setEditContact(employee.contact);
  };

  // function to handle saving after editing
  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/employees/${editingId}`,
        { name: editName, position: editPosition, contact: editContact },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );
      fetchEmployees(); 
      setEditingId(null); 
      // exit editing mode
      setError('')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update employee');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Employee List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-center">
        <table className="table table-striped table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                {editingId === employee._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editContact}
                        onChange={(e) => setEditContact(e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success me-2" onClick={handleEditSave}>
                        Save
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{employee.name}</td>
                    <td>{employee.position}</td>
                    <td>{employee.contact}</td>
                    <td>
                      <button className="btn btn-primary me-2" onClick={() => startEditing(employee)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(employee._id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
