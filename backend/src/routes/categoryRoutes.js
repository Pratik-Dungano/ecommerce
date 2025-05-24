const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.get('/shop', categoryController.getShopCategories);

// Admin routes
router.get('/admin/all', verifyToken, verifyAdmin, categoryController.getAllCategories);
router.post('/', verifyToken, verifyAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);
router.put('/:id/featured', verifyToken, verifyAdmin, categoryController.toggleCategoryFeatured);

// Subcategory routes
router.post('/:categoryId/subcategory', verifyToken, verifyAdmin, categoryController.addSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId', verifyToken, verifyAdmin, categoryController.updateSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId', verifyToken, verifyAdmin, categoryController.deleteSubcategory);

module.exports = router; 