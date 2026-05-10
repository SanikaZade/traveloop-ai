import jwt from 'jsonwebtoken';
import db from '../utils/jsonDb.js';

// Updated to use JSON Storage for the database-less demo
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Use JSON storage instead of Mongoose User.findById
      const user = await db.findOne('users', { _id: decoded.id });
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Remove password from request object for security
      const { password, ...userWithoutPassword } = user;
      req.user = { ...userWithoutPassword, id: user._id };
      
      return next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Auth middleware error:', error.message);
      }
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};
