import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

/**
 * @param {boolean} success - Status of the request
 * @param {string} message - Human-readable message
 * @param {object} data - The actual payload (user, token, etc.)
 */
export const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
