import { sendResponse } from '../library/utils.js';
import Service from '../models/service.model.js';

export const getAllServices = async (req, res) => {
  try {
    // 1. Destructure all possible query parameters
    const { q, category, city, sort, page = 1, limit = 10 } = req.query;

    // 2. Build a dynamic filter object
    let filter = { isActive: true }; // Only show active services by default

    if (q) {
      // Uses the text index you created in your schema
      filter.$text = { $search: q };
    }

    if (category) {
      filter.category = category; // Assumes category ID is passed
    }

    if (city) {
      // Use case-insensitive regex if you want "kolkata" to match "Kolkata"
      filter.city = { $regex: city, $options: 'i' };
    }

    // 3. Setup Sorting logic
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sort === 'rating') sortOptions = { avgRating: -1 };
    if (sort === 'price_low') sortOptions = { price: 1 };

    // 4. Execute Query with Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(filter)
      .populate('business', 'name logo')
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // 5. Get total count for frontend pagination controls
    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      results: services.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: services,
    });
  } catch (error) {
    console.log(`Error in getAllServices: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId)
      .populate('business', 'businessName logo')
      .populate('category', 'name');

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }

    sendResponse(res, 200, true, 'Service retrieved successfully', service);
  } catch (error) {
    console.log(`Error in getServiceById: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      price,
      priceType,
      images,
      city,
      availableDays,
      availableTime,
    } = req.body;

    const business = req.business._id;

    // 1. Basic validation for required fields
    if (!business || !category || !name || !price || !priceType || !city) {
      return res.status(400).json({
        message: 'Please provide all required fields.',
      });
    }

    // 2. Create the service instance
    const newService = new Service({
      business,
      category,
      name,
      description,
      price,
      priceType,
      images,
      city,
      availableDays,
      availableTime,
    });

    // 3. Save to database
    const service = await newService.save();

    // 4. Send success response
    return sendResponse(
      res,
      201,
      true,
      'Service created successfully',
      service,
    );
  } catch (error) {
    console.log(`Error creating service: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const {
      category,
      name,
      description,
      price,
      priceType,
      images,
      city,
      availableDays,
      availableTime,
    } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }

    // Update fields if provided
    if (category) service.category = category;
    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = price;
    if (priceType) service.priceType = priceType;
    if (images) service.images = images;
    if (city) service.city = city;
    if (availableDays) service.availableDays = availableDays;
    if (availableTime) service.availableTime = availableTime;

    await service.save();

    sendResponse(res, 200, true, 'Service updated successfully', service);
  } catch (error) {
    console.log(`Error in updateService: ${error.message}`);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();

    sendResponse(res, 200, true, 'Service deleted successfully');
  } catch (error) {
    console.log(`Error in deleteService: ${error.message}`);
    sendResponse(res, 500, false, 'Internal server error');
  }
};
