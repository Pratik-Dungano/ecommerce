const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/navbar', categoryController.getNavbarCategories);
router.get('/shop', categoryController.getShopCategories);

// Admin routes
router.use(authenticateToken, isAdmin);
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id/display', categoryController.toggleCategoryDisplay);
router.post('/:categoryId/subcategories', categoryController.addSubcategory);
router.put('/:categoryId/subcategories/:subcategoryId', categoryController.updateSubcategory);
router.delete('/:categoryId/subcategories/:subcategoryId', categoryController.deleteSubcategory);

module.exports = router; 