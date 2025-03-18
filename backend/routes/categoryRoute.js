import express from 'express';
import { 
    getAllCategories, 
    getAllCategoriesAdmin,
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory 
} from '../controllers/categoryController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/list', getAllCategories); 
router.get('/:identifier', getCategoryById);

// Admin only routes - requires authentication and admin privileges
router.get('/admin/all', adminAuth, getAllCategoriesAdmin);
router.post('/', adminAuth, createCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

// Subcategory routes - all admin only
router.post('/:categoryId/subcategory', adminAuth, addSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId', adminAuth, updateSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId', adminAuth, deleteSubcategory);

export default router; 