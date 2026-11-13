import {sendMail} from "../../utils/mail/send.mail.js";
import {Notification} from "../../models/notification.model.js";

export const sendNotificationService = async (projectId,to, recipientId, title, body, data,channel) => {
//Sending the notification to the recipient using the provided parameters
//   console.log("data",to)

let notification;
if(channel ==="email"){
    notification = await sendMail(projectId,to, title, body,recipientId);

}


if(!notification){
    throw new Error("Failed to send notification");

}
  
return notification;



 }


