import { userModel } from '../models/user.model.js';
import UserLoginService from '../services/login.js';
import UserSignupService from '../services/signup.js';
import { logger } from '../logger/logger.js';
import GetUserListService from '../services/getUserList.js';
import GetOtpService from '../services/getOtp.js';

const loginUser = async (req, res) => {
  logger.info(`Login api Executing`);
  const userLoginService = new UserLoginService(userModel);
  const responseMessage = await userLoginService.login(req);
  logger.info(`Login api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const signupUser = async (req, res) => {
  logger.info(`Signup api Executing`);
  const userSignupService = new UserSignupService(userModel);
  const responseMessage = await userSignupService.signup(req);
  logger.info(`Signup api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const getUsers = async (req, res) => {
  logger.info('GetUsers API Executing');
  const getUserListService = new GetUserListService(userModel);
  const responseMessage = await getUserListService.getUserList(req);
  res.status(responseMessage.status).json(responseMessage);
  logger.info('GetUsers API Executed');
};


const otpToResetPassword = async (req, res) => {
  logger.info('Get OTP service is executing');
  console.log(req.method);
  const getOtpService = new GetOtpService(userModel);
  let responseMessage;
  if (req.method === 'GET') {
    responseMessage = await getOtpService.getOtp(req);
  } else responseMessage = await getOtpService.verifyOtpAndSavePassword(req);
  res.status(responseMessage.status).json(responseMessage);
  logger.info('Get OTP service is executing');
};

export {
  loginUser,
  signupUser,
  getUsers,
  otpToResetPassword,
};
