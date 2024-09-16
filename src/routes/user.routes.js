import express from 'express';
import {
  loginUser,
  signupUser,
  otpToResetPassword,
  getUsers
} from '../controller/user.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', signupUser);
userRouter.get('/getOTP', otpToResetPassword);
userRouter.post('/verifyOtp', otpToResetPassword);
userRouter.get('/getUsers', verifyJWTToken, getUsers);


export { userRouter };
