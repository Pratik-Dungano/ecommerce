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
        const { name, description, image, active } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        
        // Convert name to slug
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if category with this slug already exists
        const existingCategory = await CategoryModel.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'A category with this name already exists' });
        }
        
        // Create new category
        const newCategory = new CategoryModel({
            name,
            slug,
            description,
            image,
            active: active !== undefined ? active : true
        });
        
        const savedCategory = await newCategory.save();
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: savedCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, active } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }
        
        const category = await CategoryModel.findById(id);
        
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        // Update category fields
        if (name) {
            category.name = name;
            // Update slug if name changes
            category.slug = name.toLowerCase().replace(/\s+/g, '-');
        }
        
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (active !== undefined) category.active = active;
        
        const updatedCategory = await category.save();
        
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
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

// Get featured categories for the homepage
export const getFeaturedCategories = async (req, res) => {
    try {
        const featuredCategories = await CategoryModel.find({ 
            active: true,
            featured: true 
        }).sort({ displayOrder: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: featuredCategories.length,
            categories: featuredCategories 
        });
    } catch (error) {
        console.error('Error fetching featured categories:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle featured status (admin only)
export const toggleFeaturedCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { featured, displayOrder } = req.body;
        
        const category = await CategoryModel.findById(id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }
        
        // Update featured status and display order
        category.featured = featured !== undefined ? featured : category.featured;
        category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
        
        await category.save();
        
        res.status(200).json({
            success: true,
            message: `Category ${featured ? 'featured' : 'unfeatured'} successfully`,
            category
        });
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle category display settings
export const toggleCategoryDisplay = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayInNavbar } = req.body;

    console.log('Toggling category display:', { id, displayInNavbar });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category ID' 
      });
    }

    const category = await CategoryModel.findById(id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Update the displayInNavbar field
    category.displayInNavbar = displayInNavbar;
    await category.save();

    console.log('Category updated successfully:', category);

    res.status(200).json({ 
      success: true, 
      message: `Category ${displayInNavbar ? 'shown' : 'hidden'} in navbar`,
      category 
    });
  } catch (error) {
    console.error('Error updating category display settings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating category display settings',
      error: error.message 
    });
  }
}; 