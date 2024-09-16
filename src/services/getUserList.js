import { logger } from '../logger/logger.js';
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';


export default class GetUserListService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  getUserList = async req => {
    try {
      logger.info('Inside getUserList method');
     
      // Perform scan operation to get all users
      const userList = await this.#userModel.scan().exec();
      return sendResponse(CODES.OK, userList);
    } catch (error) {
      logger.error(`Error in Get User List API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get User List API');
    }
  }

}
