import { sendResponse } from "../library/utils.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return sendResponse(res, 200, true, 'User profile retrieved successfully', user)
  } catch (error) {
    console.log('Error in getUserProfile:', error.message)
    return res.status(500).json({ error: error.message })
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return sendResponse(res, 200, true, 'User profile updated successfully', user)
  } catch (error) {
    console.log('Error in updateUserProfile:', error.message)
    return res.status(500).json({ error: error.message })
  }
}