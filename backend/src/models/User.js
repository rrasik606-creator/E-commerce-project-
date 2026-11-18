import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(

    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:8,
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        blocked:{
            type:Boolean,
            default:false
        }
    },

    {timestamps:true}

);

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    this.password= await bcrypt.hash(this.password,10);
});

const User=mongoose.model("User",userSchema);

export default User;