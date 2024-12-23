const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

const register = async (req, res) => {
  const { email, password } = req.body;

  if(!email){
    return res.status(400).json({message: "please enter your email" })
  }
  if(!password){
    return res.status(400).json({message: "please enter your password" })
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        message:
          "Password must be at least 6 characters long, contain at least one letter, one number, and one special character",
      });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //important
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email " });
  }
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: "Invalid password " });
  }
  

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

module.exports = { register, login };