import express from 'express';
import { userSignup } from '../controllers/user.js'; 

const router = express.Router();

router.post('/user_signup', userSignup); 

export default router;
