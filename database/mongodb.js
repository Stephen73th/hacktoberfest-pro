import mongoose from 'mongoose';
import { MONGODB_URL } from '../config/env.js';    

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGODB_URL)
        console.log('Alrighty! MongoDb is connected sucessfully!')
    }
    catch(error){
        console.log('Error is in MongoDB connection', error)
    }
} 