import express from 'express';
import {loginUser,registerUser,adminLogin,getUser,updateUser} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const useRouter=express.Router();

useRouter.post('/register',registerUser)
useRouter.post('/login',loginUser)
useRouter.post('/admin',adminLogin)
useRouter.get('/', authUser, getUser);
useRouter.put('/update', authUser, updateUser);

export default useRouter;