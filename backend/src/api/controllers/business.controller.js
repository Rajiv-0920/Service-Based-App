import mongoose from 'mongoose';
import { sendResponse } from '../library/utils.js';
import Business from '../models/business.model.js';
import Service from '../models/service.model.js';

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

export const updateBusinessProfile = async (req, res) => {
  try {
    const id = req.business._id;
    const business = await Business.findById(id);

    if (!business) {
      return sendResponse(res, 404, false, 'Business profile not found');
    }

    Object.assign(business, req.body);
    await business.save();

    return sendResponse(
      res,
      200,
      true,
      'Business profile updated successfully',
      business,
    );
  } catch (error) {
    console.log(`Error in UpdateBusinessProfile: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBusinessServices = async (req, res) => {
  try {
    const { id } = req.params;

    const services = await Service.find({
      business: id,
    });

    return sendResponse(
      res,
      200,
      true,
      'Services retrieved successfully',
      services,
    );
  } catch (error) {
    console.log(`Error in getBusinessServices: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
