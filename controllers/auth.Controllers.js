import mongoose from 'mongoose'
import auth from '../models/auth.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';



export const SignUp = async (req, res, next) =>{
    
    const session = await mongoose.startSession();
    session.startTransaction();
    

    



    try{
        const {name, email, password, track} = req.body;

    // check if any data is missing
    if(!name || !email || !password || !track){
        return res.status(400).json({message: "All fields are required"})
    }


    const existingUser = await auth.findOne({email}).session(session)
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt); //hash password

    const newUser = await auth.create( [{name, email, password:hashpassword, track}], {session}) //created a new user


    const token = jwt.sign({userId: newUser[0]._id, email: newUser[0]}, JWT_SECRET, {expiresIn:JWT_EXPIRES_IN }) //generate a token
    // introduce a secret 

    await session.commitTransaction(); //commit the transaction
    session.endSession()

    return res.status(201).json({
        message: "user created successfully",
        user: {
            id: newUser[0]._id,
            name: newUser[0].name,
            email: newUser[0].email,
            track: newUser[0].track,
            token: token
        }
    })

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message: "Something went wrong"})
    }

    

  
} 






// res.send("Signup route", SignUp)
    // console.log("Alright, this is User signup api")


export const SignIn = async (req, res, next) => {

    try{
        const {email, password} = req.body;

    // check if any data is missing
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }
    const User = await auth.findOne({email});
    if(!User){
        return res.status(400).json({message: "User not found"})
    }

    const isPasswordValid = await bcrypt.compare(password, User.password)
    if (!isPasswordValid){
        return res.status(400).json({message: "Invalid credentials"})
    }
    const token = jwt.sign({userId: User._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN}
    )
    res.status(200).json({
        success: true,
        message: "User signed in successfully",
        token: token,
        data: {
            id: User._id,
            name: User.name,
            email: User.email,
            track: User.track
        }
    })

    }catch(error){
    next(error)
    }


    // res.send("Signin route", SignIn)
    // console.log("Alright, this is User signin api")
}