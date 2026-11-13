import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    passwordHash:{
        type:String,
        required:true,
        minLength:8
    },
    email:{
        type:String,
        required:true,
        unique:true
        ,
        trim:true
    },
    otp:{
 code: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    },
    
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["owner", "admin", "member", "user"],
        default: "user"
    }

},{
    timestamps:true
})


userSchema.pre('save',async function () {
    if(!this.isModified("passwordHash")){
        return
    }
    this.passwordHash = await bcrypt.hash(this.passwordHash,12)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.passwordHash)
}




export const User = mongoose.model("User", userSchema);