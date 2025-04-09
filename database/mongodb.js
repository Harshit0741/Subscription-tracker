import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
import process from "process";

if(!DB_URI){
    throw new Error('pls define');
}

const connectToDatabase =async()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`Connect to database in ${NODE_ENV} mode`);
        
    }catch(err){
        console.error('error',err);
        process.exit(1);
    }
}

export default connectToDatabase;