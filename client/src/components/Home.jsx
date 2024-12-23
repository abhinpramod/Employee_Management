import React, { useState, useEffect } from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // State to handle Add Employee dialog
  const [confirmOpen, setConfirmOpen] = useState(false); // State for Delete Confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // Store the ID of the employee to delete
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError(" Please log in.");
      navigate("/");
    } else {
      fetchEmployees();
    }
  }, [navigate, token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      setError("Failed to fetch employees.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
      setConfirmOpen(false); // Close confirmation dialog after deletion
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete employee");
      setConfirmOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openDialog = () => setOpen(true); // Open Add Employee Dialog
  const closeDialog = () => setOpen(false); // Close Add Employee Dialog

  const openConfirmDialog = (id) => {
    setDeleteId(id); // Set the ID of the employee to delete
    setConfirmOpen(true); // Open confirmation dialog
  };

  const closeConfirmDialog = () => setConfirmOpen(false); // Close confirmation dialog

  return (
    <div>
      {/* MUI Navbar with AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#386f6e', width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Management
          </Typography>
          <Button sx={{ backgroundColor: '#ca447c', color: '#fff' }} onClick={openDialog}>
            Add Employee
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button sx={{ backgroundColor: '#ff0000', color: '#fff' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Employee Table */}
      <div className="container">
        <EmployeeTable
          employees={employees}
          onDelete={openConfirmDialog} // Pass openConfirmDialog to handle delete
          token={token}
          fetchEmployees={fetchEmployees}
        />
      </div>

      {/* MUI Dialog for Adding Employees */}
      <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Employee
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AddEmployee
            token={token}
            fetchEmployees={fetchEmployees}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <p className="text-center text-danger" style={{ fontSize: "1.2rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Home;
