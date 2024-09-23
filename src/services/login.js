import { encrypt, sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { generateAccessToken, generateRefreshToken } from '../security/auth.js';
import { logger } from '../logger/logger.js';
import bcrypt from "bcryptjs";

export default class UserLoginService {
  #userConnection;
  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  login = async req => {
    try {
      logger.info(`Checking if user exists or not`);
      const { password, role } = req.body;
      const email = req.body.email.toLowerCase();

      let userQuery = { email };
      
      const user = await this.#userConnection.get(userQuery);
      
      if (!user) {
        
        return sendResponse(CODES.UNAUTHORIZED, 'Invalid email');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch)

      if (!isMatch) {
        return sendResponse(CODES.UNAUTHORIZED, "Invalid password");
      }

      const token = await generateAccessToken({
        username: user.name,
        email: user.email,
      });

      logger.info('Login Success!!!!');
      console.log(token)
      return sendResponse(CODES.OK, 'User logged in successfully', {
        token: token,
      });
    } catch (err) {
      logger.error(`${err}`);
      throw new Error('Error in login API Call');
    }
  };

  
}
