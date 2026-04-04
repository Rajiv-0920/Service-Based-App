import { generateToken, sendResponse } from '../library/utils.js';
import Business from '../models/business.model.js';
import User from '../models/user.model.js';
import admin from '../../config/firebase.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });

    const token = generateToken(res, newUser._id);
    await newUser.save();

    const responseData = {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone,
        address: newUser.address,
      },
    };

    return sendResponse(
      res,
      201,
      true,
      'User registered successfully',
      responseData,
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerBusiness = async (req, res) => {
  try {
    const { businessName, email, phone, description, address } = req.body;

    if (!businessName || !email || !phone) {
      return res
        .status(400)
        .json({ message: 'Business name, email, and phone are required' });
    }

    const existingBusiness = await Business.findOne({ owner: req.user._id });
    if (existingBusiness) {
      return res
        .status(400)
        .json({ message: 'You have already registered a business' });
    }

    const emailTaken = await Business.findOne({ email });
    if (emailTaken) {
      return res
        .status(400)
        .json({ message: 'A business with this email already exists' });
    }

    const business = await Business.create({
      owner: req.user._id,
      businessName,
      email,
      phone,
      description,
      address,
    });

    return sendResponse(
      res,
      201,
      true,
      'Business registered successfully. Awaiting admin approval.',
      business,
    );
  } catch (error) {
    console.log(`Error in registerBusiness controller: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(res, user._id);
    return sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
      token: token,
    });
  } catch (error) {
    console.log(`Error in login controller: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('token');
    return sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    console.log(`Error in logout controller: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return sendResponse(res, 200, true, 'User retrieved successfully', user);
  } catch (error) {
    console.log(`Error in getMe controller: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have a googleId yet, link it
      if (!user.googleId) {
        user.googleId = uid;
        if (!user.avatar) user.avatar = picture; // Optional: update avatar
        await user.save();
      }
    } else {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        googleId: uid,
        avatar: picture,
        // Password is left undefined here
      });
    }

    // 3. Generate App JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 4. Set Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5. Return JSON (Crucial for RTK Query to "see" the token)
    res.status(200).json({
      success: true,
      token, // Frontend saves this to localStorage
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('DETAILED FIREBASE ERROR:', error.code, error.message);
    res.status(401).json({ message: error.message });
  }
};
