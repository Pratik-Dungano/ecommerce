import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authUser, addReview);
router.get('/product/:productId', getProductReviews);

export default router;