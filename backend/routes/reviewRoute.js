import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import { validateAddReviewInput } from '../middleware/validationMiddleware.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authUser, validateAddReviewInput, addReview);
router.get('/product/:productId', getProductReviews);

export default router;