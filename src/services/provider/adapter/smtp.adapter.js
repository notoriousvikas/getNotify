import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();




export const sendEmail = async (to,subject,text,fromEmail,pass,host,port)=>{
   const smtpPort = Number(port);

  const transporter = nodemailer.createTransport({
    host,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: fromEmail,
      pass
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000
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