import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (to,subject,text)=>{
  console.log("reached smptp")
 
 try {
  const sendingMail = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text
  });
  
     
  console.log("Email sent successfully:", sendingMail.messageId);
   return sendingMail;
} catch (error) {
  console.error("Email sending failed!");
  console.error("Message:", error.message);
  console.error("Code:", error.code);
  console.error("Command:", error.command);
  console.error("Response:", error.response);
  console.error("Response Code:", error.responseCode);

  throw error;
}
  
      
}