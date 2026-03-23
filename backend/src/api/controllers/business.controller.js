import { sendResponse } from '../library/utils.js';
import Business from '../models/business.model.js';

export const getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.find({ owner: req.user._id });

    if (business.length === 0) {
      return sendResponse(res, 404, false, 'Business profile not found');
    }

    const businessProfile = business[0];

    return sendResponse(
      res,
      200,
      true,
      'Business profile retrieved successfully',
      businessProfile,
    );
  } catch (error) {
    console.log(`Error in getBusinessProfile: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPublicBusinessProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id)
      .select('-__v -isApproved -isSuspended')
      .populate('owner', 'name');

    if (!business) {
      return sendResponse(res, 404, false, 'Business profile not found');
    }

    return sendResponse(
      res,
      200,
      true,
      'Business profile retrieved successfully',
      business,
    );
  } catch (error) {
    console.log(`Error in getPublicBusinessProfile: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
