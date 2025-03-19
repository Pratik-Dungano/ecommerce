import express from 'express';
import { 
  getAllLooks, 
  getActiveLooks, 
  getLookById, 
  createLook, 
  updateLook, 
  deleteLook 
} from '../controllers/lookController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveLooks);
router.get('/:id', getLookById);

// Admin routes
router.route('/')
  .get(adminAuth, getAllLooks)
  .post(adminAuth, createLook);

router.route('/:id')
  .put(adminAuth, updateLook)
  .delete(adminAuth, deleteLook);

export default router; 