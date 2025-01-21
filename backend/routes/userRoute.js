import express from 'express';
import {loginUser,registerUser,adminLogin} from '../controllers/userController.js';

const useRouter=express.Router();

useRouter.post('/register',registerUser)
useRouter.post('/login',loginUser)
useRouter.post('/admin',adminLogin)

export default useRouter;