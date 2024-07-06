const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {protect} = require('../middleware/authMiddleware');
const User = require('../models/User');


// Example protected route - Principal dashboard
router.get('/dashboard', protect, (req, res) => {
  // Access req.user to get authenticated user details
  res.json({ message: 'Welcome to Principal Dashboard!', user: req.user });
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login endpoint hit');
  console.log(`Comparing passwords for: ${email}`);

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Invalid credentials for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful for:', email);
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.post('/change-password', protect, async (req, res) => {
    console.log('Change password endpoint hit');
  
    // Ensure req.user is correctly set by the protect middleware
    const userId = req.user ? req.user.id : null;
  
    try {
      // Find user
      const user = await User.findById(userId);
  
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check current password
      const passwordMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!passwordMatch) {
        console.log('Current password is incorrect for:', user.email);
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
  
      // Update password
      const hash = await bcrypt.hash(req.body.newPassword, 10);
      user.password = hash;
      await user.save();
  
      console.log('Password updated successfully for:', user.email);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
