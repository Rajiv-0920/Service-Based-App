import { sendResponse } from '../library/utils.js';
import Category from '../models/category.model.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return sendResponse(
      res,
      200,
      true,
      'Categories retrieved successfully',
      categories,
    );
  } catch (error) {
    console.log(`Error retrieving categories: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getServicesByCategory = async (req, res) => {};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = new Category({ name, slug });

    await category.save();

    return sendResponse(
      res,
      201,
      true,
      'Category created successfully',
      category,
    );
  } catch (error) {
    console.log(`Error creating category: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true },
    );

    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }

    return sendResponse(
      res,
      200,
      true,
      'Category updated successfully',
      category,
    );
  } catch (error) {
    console.log(`Error updating category: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }

    return sendResponse(res, 200, true, 'Category deleted successfully');
  } catch (error) {
    console.log(`Error deleting category: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
