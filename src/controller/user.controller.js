import { User } from "../models/user.model.js";
import {generateToken} from "../utils/generateToken.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { verifyUser,sendOtpToUser } from "../services/verifyUser/verifyUser.service.js";

const regsiterUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("password and email as well as name is required", 400);
  }
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exist with this email", 400);
  }
  const CreateUser = await User.create({
    name: name,
    email: email.toLowerCase(),
    passwordHash: password,
  });
  if (!CreateUser) {
    throw new AppError("Server side error ", 500);
  }


 
  return generateToken(res, CreateUser, "Account created Suuucessfullyy");
});



const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return generateToken(res, user, "User logged in successfully");
});

const signOut = catchAsync(async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});

const getCurrentUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
const sendOtp = catchAsync(async(req,res)=>{
 const userId = req.user._id;
 const sendingOtp = await sendOtpToUser(userId);
 if(!sendingOtp){
    throw new AppError("sending otp failed",402)
 }
 return   res.status(201).json({
    status: "success",
  
  });
})

const verifyUserOtp = catchAsync(async(req,res)=>{
  const userId = req.user._id;
  const {otp} = req.body;
  const verifyUser = await verifyUser(userId,otp);
  if(verifyUser===false){
       return res.status(400).json({status:"failed"})
  }

  return res.status(200).json({message:"user email verified succesfully"})
})
export { regsiterUser, loginUser, signOut, getCurrentUserProfile, sendOtp,verifyUserOtp };