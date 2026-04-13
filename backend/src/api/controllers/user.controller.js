import mongoose from 'mongoose';
import { sendResponse } from '../library/utils.js';
import User from '../models/user.model.js';
import Business from '../models/business.model.js';
import Service from '../models/service.model.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return sendResponse(
      res,
      200,
      true,
      'User profile retrieved successfully',
      user,
    );
  } catch (error) {
    console.log('Error in getUserProfile:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, avatar, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, avatar },
      { returnDocument: 'after' },
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return sendResponse(
      res,
      200,
      true,
      'User profile updated successfully',
      user,
    );
  } catch (error) {
    console.log('Error in updateUserProfile:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return sendResponse(res, 200, true, 'Password updated successfully', null);
  } catch (error) {
    console.log('Error in updateUserPassword:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  // 1. Start the session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user._id;

    // 2. Find the business (must pass session in an object for findOne)
    const business = await Business.findOne({ owner: userId }).session(session);

    if (business) {
      // 3. Delete all services linked to this business
      await Service.deleteMany({ business: business._id }, { session });

      // 4. Delete the business
      await Business.deleteOne({ _id: business._id }, { session });
    }

    // 5. Delete the user
    // NOTE: findByIdAndDelete uses (id, options)
    const deletedUser = await User.findByIdAndDelete(userId, { session });
    res.clearCookie('token');

    if (!deletedUser) {
      throw new Error('User not found');
    }

    // 6. Commit and clean up
    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: 'Account and all related data deleted successfully',
    });
  } catch (error) {
    // 7. Rollback on any error
    await session.abortTransaction();
    console.error('Transaction Aborted. Error:', error.message);

    const statusCode = error.message === 'User not found' ? 404 : 500;
    return res.status(statusCode).json({ error: error.message });
  } finally {
    // 8. Always end the session
    await session.endSession();
  }
};
