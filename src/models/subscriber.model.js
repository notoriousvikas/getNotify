import mongoose from "mongoose";
import { boolean, lowercase } from "zod";

const subscriberSchema = new mongoose.Schema({
   projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null, // null for system/platform-wide Subscribers
        index: true,
      },
      externalId:{
        type:String,
        
      },
      email:{
        type:String,
        lowercase:true,
        trim:true
      },
      phone:{
        type:String,
        trim:true
      },
      firstName:{
        type:String
      },
      lastName:{
        type:String
      },
      preferences:{
        email:{
            type:boolean,
            default:true
        },
          sms:{
            type:boolean,
            default:true
        },
        inApp:{
             type:boolean,
             default:true
        }
      }

}
,{
    timestamps:true
}
)

subscriberSchema.index(
  { project: 1, externalId: 1 },
  { unique: true }
);

export const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
