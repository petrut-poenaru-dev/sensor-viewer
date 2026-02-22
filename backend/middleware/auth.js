const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obține token din header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acces interzis. Token lipsă.' 
      });
    }

    // Verifică token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token invalid sau expirat.' 
    });
  }
};

module.exports = authMiddleware;
