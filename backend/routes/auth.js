const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('Auth routes loaded');
// Register validation rules and route
router.post('/register', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('role').isIn(['student', 'parent', 'teacher']),
  async (req, res) => {

    console.log('Register route hit');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role, linkedStudents } = req.body;

    try {
      if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = password;
      console.log('Pass:', password, 'Hash:', hashedPassword);

      const user = new User({ name, email, password: hashedPassword, role, linkedStudents: linkedStudents || [] });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Login validation and route
router.post('/login', 
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    console.log('Login route hit');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      console.log(password, user.password);
      
      const isMatch = ( password == user.password );
      console.log(isMatch);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log(token, user);

      const responseData = {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      };
      
      console.log(responseData); // Log the object, not the result of res.json
      
      res.json(responseData); // Send the response once
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
          }
  });

module.exports = router;
