const express = require('express');
const mongoose = require('mongoose'); //important
const cors = require('cors');
const authRoutes = require('./Routes/auth');
const employeeRoutes = require('./Routes/employee');
const { authenticate } = require('./Middleware/authenticateToken');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', //important
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/employees', authenticate, employeeRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

