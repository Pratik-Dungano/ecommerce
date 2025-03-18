import mongoose from 'mongoose';
import CategoryModel from '../models/categoryModel.js';

// Get all categories with subcategories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ active: true });
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all categories (including inactive ones) - for admin use
export const getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single category by ID or slug
export const getCategoryById = async (req, res) => {
    try {
        const { identifier } = req.params;
        
        let query = {};
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier };
        } else {
            query = { slug: identifier };
        }
        
        const category = await CategoryModel.findOne(query);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        
        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if category with the same slug already exists
        const existingCategory = await CategoryModel.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'A category with this name already exists' });
        }
        
        const category = new CategoryModel({
            name,
            slug,
            description,
            image,
            subcategories: [] // Explicitly set an empty array
        });
        
        await category.save();
        
        res.status(201).json({ success: true, category });
    } catch (error) {
        console.error('Category creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, active } = req.body;
        
        const category = await CategoryModel.findById(id);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        // Update fields if provided
        if (name) {
            category.name = name;
            category.slug = name.toLowerCase().replace(/\s+/g, '-');
        }
        
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (active !== undefined) category.active = active;
        
        await category.save();
        
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedCategory = await CategoryModel.findByIdAndDelete(id);
        
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a subcategory to a category
export const addSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;
        
        const category = await CategoryModel.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if subcategory with the same slug already exists in this category
        const existingSubcategory = category.subcategories.find(sub => sub.slug === slug);
        if (existingSubcategory) {
            return res.status(400).json({ 
                success: false, 
                message: 'A subcategory with this name already exists in this category' 
            });
        }
        
        category.subcategories.push({
            name,
            slug,
            description
        });
        
        await category.save();
        
        res.status(201).json({ 
            success: true, 
            subcategory: category.subcategories[category.subcategories.length - 1] 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a subcategory
export const updateSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        const { name, description, active } = req.body;
        
        const category = await CategoryModel.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        const subcategory = category.subcategories.id(subcategoryId);
        
        if (!subcategory) {
            return res.status(404).json({ success: false, message: 'Subcategory not found' });
        }
        
        // Update fields if provided
        if (name) {
            subcategory.name = name;
            subcategory.slug = name.toLowerCase().replace(/\s+/g, '-');
        }
        
        if (description !== undefined) subcategory.description = description;
        if (active !== undefined) subcategory.active = active;
        
        await category.save();
        
        res.status(200).json({ success: true, subcategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        
        const category = await CategoryModel.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        // Find the subcategory index
        const subcategoryIndex = category.subcategories.findIndex(
            sub => sub._id.toString() === subcategoryId
        );
        
        if (subcategoryIndex === -1) {
            return res.status(404).json({ success: false, message: 'Subcategory not found' });
        }
        
        // Remove the subcategory
        category.subcategories.splice(subcategoryIndex, 1);
        
        await category.save();
        
        res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 