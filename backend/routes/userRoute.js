import express from 'express';
import {loginUser,registerUser,adminLogin,getUser,updateUser} from '../controllers/userController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', validateRegisterInput, registerUser)
userRouter.post('/login', validateLoginInput, loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/', authUser, getUser);
userRouter.put('/update', authUser, updateUser);

export default userRouter;