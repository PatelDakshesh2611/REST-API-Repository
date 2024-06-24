// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name);
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, "Dakshesh_Patel", { expiresIn: '1h' });

    // Respond with token
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "Dakshesh_Patel", { expiresIn: '1h' });

    // Respond with token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkToken = async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token,"Dakshesh_Patel" , (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ valid: false });
      }
      // Token is valid
      res.status(200).json({ valid: true });
    });
  } catch (error) {
    console.error('Error checking token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};