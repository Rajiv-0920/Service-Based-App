import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Check for token in Authorization Header (priority)
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback to Cookies (if using httpOnly cookies)
    if (req.cookies.token) token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Find User
    // Note: Use decoded.userId because your login/googleLogin
    // controller used jwt.sign({ userId: user._id }, ...)
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // 5. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
