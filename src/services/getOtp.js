import { sendResponse } from '../common/common.js';
import { mailObj, transporter } from '../common/mail.config.js';
import { CODES } from '../common/response-code.js';
import bcrypt from 'bcryptjs';

export default class GetOtpService {
  #userConnection;

  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  getOtp = async (req) => {
    try {
      const { email } = req.body
      const user = await this.#userConnection.get(email);
      if (!user) return sendResponse(CODES.BAD_REQUEST, 'User Not Found');

      let otp = Math.floor(100000 + Math.random() * 900000);
      user[0].otp = otp;
      user[0].expireTime = Date.now() + 15 * 60 * 1000;
      await user.save();

      await transporter.sendMail(
        await mailObj({
          subject: 'OTP to reset Password',
          content: `Use this OTP to reset the password: ${otp}`,
          mailto: user[0].email
        })
      );

      
      return sendResponse(CODES.OK, 'OTP sent');
    } catch (error) {
      console.error('Error in getting OTP:', error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in send OTP');
    }
  };

  verifyOtpAndSavePassword = async (req) => {
    try {
      
      const { email, otp, newPassword } = req.body;

      if (!email || !otp) {
        return sendResponse(CODES.BAD_REQUEST, 'Please Enter OTP and Email');
      }

      const user = await this.#userConnection.scan({
        email: { eq: email },
        otp: { eq: otp },
        expireTime: { gt: Date.now() }
      }).exec();
      
      if (!user.count) {
        return sendResponse(CODES.BAD_REQUEST, 'Invalid OTP or OTP has expired');
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      await this.#userConnection.update({ email }, {
        otp: 0,
        expireTime: 0,
        hashPassword: hashPassword
      });

      return sendResponse(CODES.OK, 'OTP Verified Successfully and New Password has been Set');
    } catch (error) {
      console.error('Error in verifying OTP:', error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in verifying OTP');
    }
  };
}
