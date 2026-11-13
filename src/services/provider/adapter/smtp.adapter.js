import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();




export const sendEmail = async (to,subject,text,fromEmail,pass,host,port)=>{
  console.log("reached smptp")
   const transporter = nodemailer.createTransport({
   host: host,
  port: port,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: fromEmail,
    pass: pass,
  },
});
 try {
  const sendingMail = await transporter.sendMail({
    from: fromEmail,
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