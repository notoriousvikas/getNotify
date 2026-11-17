import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subscriber",
        index:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        index:true
    },
    token:{
        type:String,
        required:true
    },
    platform:{
        type:String,
        enum:["android","ios","web"],
        required:true
    }
},{
    timeStamps:true
})

deviceSchema.index(
  { project: 1, token: 1 },
  { unique: true }
);

export const Device = mongoose.models.Device || mongoose.model("Device",deviceSchema)