const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  position: { type: String, required: true },
  contact: { type: Number, required: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
