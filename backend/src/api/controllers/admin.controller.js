import Business from '../models/business.model.js';
import User from '../models/user.model.js';
import { sendResponse } from '../library/utils.js';
import Service from '../models/service.model.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return sendResponse(res, 200, true, 'Users fetched successfully', users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    return sendResponse(
      res,
      200,
      true,
      'Businesses fetched successfully',
      businesses,
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching businesses', error });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    return sendResponse(
      res,
      200,
      true,
      'Services fetched successfully',
      services,
    );
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const approveBusiness = async (req, res) => {
  const { id } = req.params;

  // 1. Find and update business status
  const business = await Business.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true },
  );

  if (!business) return res.status(404).json({ message: 'Business not found' });

  // 2. Upgrade the User's role to 'business'
  await User.findByIdAndUpdate(business.owner, { role: 'business' });

  return sendResponse(
    res,
    200,
    true,
    'Business approved and user role upgraded.',
  );
};

export const suspendBusiness = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findByIdAndUpdate(
    id,
    { isSuspended: true, isApproved: false },
    { new: true },
  );

  if (!business) return res.status(404).json({ message: 'Business not found' });

  return sendResponse(res, 200, true, 'Business suspended successfully.');
};

export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndDelete(id);

    if (!service) return res.status(404).json({ message: 'Service not found' });

    return sendResponse(res, 200, true, 'Service deleted successfully.');
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting service', error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    const business = await Business.findOne({ owner: id });
    const services = await Service.find({ owner: id });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (business) {
      await Business.findByIdAndDelete(business._id);
    }

    const businessId = business ? business._id : null;

    if (services && businessId) {
      await Service.deleteMany({ business: businessId });
    }

    return sendResponse(res, 200, true, 'User deleted successfully.');
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};
