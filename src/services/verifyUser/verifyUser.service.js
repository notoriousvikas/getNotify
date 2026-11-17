
import { AppError } from "../../middleware/error.middleware.js";
import crypto from "crypto"; 
import { User } from "../../models/user.model.js"



const generateOTP = () => {
    const otp = crypto.randomInt(100000, 1000000).toString();

    return {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
};
const sendOtp = async (to, otp) => {
    if (!to || !otp) {
        throw new AppError("Recipient email and OTP are required", 400);
    }
    const sendotp = await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "verification email",
        text: `Your otp is ${otp}`
    })
    if (!sendotp) {
        throw new AppError("failed to send otp", 401)
    }
    return sendotp;
}

export const sendOtpToUser = async (userId) => {
    if (!to) {
        throw new AppError("no to email is provided", 401)
    }
     
    const user = await User.findById(userId)
    const { otp, expiresAt } = generateOTP()
    user.otp.code = otp;




    user.otp.expiresAt = expiresAt;
    const email = user.email;
    await user.save();
    const sentotp = await sendOtp(email, otp)
    if (!sentotp) {
        throw new AppError("cannot send otp", 400)
    }
 
  return user.otp.expiresAt;

}

export const verifyUser = async (userId, otp) => {

    const user = await User.findById(userId);
    if (user.isEmailVerified) {
        throw new AppError("user is already verified", 404)
    }
    if (!user.otp?.code || !user.otp?.expiresAt) {
        throw new AppError("No active OTP found", 400);
    }

    if (user.otp.expiresAt < new Date()) {
        throw new AppError("OTP expired", 400);
    }

    if (otp !== user.otp.code) {
        throw new AppError("Incorrect OTP", 400);
    }
    if (otp === user.otp.code && user.otp.expiresAt > new Date()) {
        user.isEmailVerified = true;
    }
    await user.save();
    if(user.isEmailVerified===true){
        return true;
    }
    return false;
}