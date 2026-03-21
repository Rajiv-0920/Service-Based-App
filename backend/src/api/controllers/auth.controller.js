import { generateToken, sendResponse } from '../library/utils.js';
import Business from '../models/business.model.js';
import User from '../models/user.model.js';

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
      _id: user._id,
      name: user.name,
      email: user.email,
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
