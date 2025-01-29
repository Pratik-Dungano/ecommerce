import express from 'express';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', validateRegisterInput, registerUser);
userRouter.post('/login', validateLoginInput, rateLimiter, loginUser);
userRouter.post('/admin', validateLoginInput, rateLimiter, adminLogin);

export default userRouter;