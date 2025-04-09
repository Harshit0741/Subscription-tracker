import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'User name req'],
        trim:true,
        minLength:2,
        maxLength:50
    },
    email:{
        type: String,
        required: [true, 'User email req'],
        trim:true,
        unique:true,
        lowercase:true,
        match: [/\S+@\S+\.\S+/, 'pls fill valid mail']
    },
    password:{
        type: String,
        required: [true, 'User password req'],
        minLength:6
    },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;
