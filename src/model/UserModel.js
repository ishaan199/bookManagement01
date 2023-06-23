const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    title:{type:String,required:true,enum:["Mr","Mrs","Ms"]},
    name:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true,minLength:8,maxLength:15},
    address:{
        street:{type:String,required:true},
        city:{type:String,required:true},
        pincode:{type:String,required:true},
    }
},{timestamps:true})

module.exports = mongoose.model("Book_User", UserSchema);