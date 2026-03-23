import Business from '../models/business.model.js';

export const isBusiness = async (req, res, next) => {
  const business = await Business.findOne({ owner: req.user.id });
  if (!business)
    return res.status(403).json({ message: 'Not a business owner' });

  req.business = business; // attach for use in controllers
  next();
};
