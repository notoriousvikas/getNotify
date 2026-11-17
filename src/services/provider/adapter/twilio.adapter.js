import twilio from "twilio";

export const sendSms =async(to,body,credentials)=>{
      const {
    accountSid,
    apiKey,
    apiSecret,from
  } = credentials || {};
  if(!accountSid ||!apiKey || !apiSecret || !from){
    const error = new Error("credentials are required ")
    error.retryable=false;
    throw error;
  }
  if(!to || !body ){
    const error = new Error("body is required")
    error.retryable=false
    throw error;
  }
  const client = twilio(apiKey,apiSecret,{accountSid});
  if(!client){
    const error = new Error("service is down try later")
    error.retryable = true;
    throw error;

}

const message = await client.messages.create({
    from,
    to,
    body
})
return message;
}