const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login - Login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username este obligatoriu'),
  body('password').notEmpty().withMessage('Parola este obligatorie')
], async (req, res) => {
  try {
    // Validare
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Găsește user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username sau parolă incorectă' 
      });
    }

    // Verifică parola
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username sau parolă incorectă' 
      });
    }

    // Actualizează lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generează JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login reușit',
      token,
      user: {
        id: user._id,
        username: user.username,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Eroare server' 
    });
  }
});

// GET /api/auth/verify - Verifică token
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User nu a fost găsit' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Eroare server' 
    });
  }
});

// POST /api/auth/logout - Logout (opțional, doar pentru logging)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logout reușit'
  });
});

module.exports = router;
