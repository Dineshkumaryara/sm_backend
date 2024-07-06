const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Register Faculty (Only Principal can do this)
router.post('/register', protect, async (req, res) => {
  console.log('Faculty registration endpoint hit');
  if (req.user.role !== 'Principal') {
    console.log('Unauthorized attempt by:', req.user.email);
    return res.status(403).json({ message: 'Only Principal can register Faculty' });
  }

  try {
    const { name, email, phone, idNumber } = req.body;
    const password = 'defaultPassword'; // You can set a default password or generate a random one

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const faculty = await User.create({ role: 'Faculty', name, email, password, phone, idNumber });
    console.log('Faculty registered successfully:', faculty);

    res.status(201).json({ message: 'Faculty registered successfully' });
  } catch (error) {
    console.error('Error registering faculty:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
