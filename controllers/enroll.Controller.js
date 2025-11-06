import mongoose from 'mongoose';
import enroll from '../models/enroll.model.js';




//Get overall attendance function
export const getOverallAttendance = async (req, res, next) => {
    
}

// Get all student with attendance
export const getAllStudentWithAttendance = async (req, res, next) => {
    
}

//Get student attendance
export const getStudentAttendance = async (req, res, next) => {
    
}


//Get enroll user

export const EnrollUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {firstName, lastName, email, phoneNo, gender, learningTrack, ATDP=0} = req.body;

        // check if any data is missing
        if(!firstName || !lastName || !email || !phoneNo || !gender || !learningTrack){
            return res.status(400).json({message: "All fields are required"})
        }


        const existingUser = await enroll.findOne({email}).session(session)
        if (existingUser){
            return res.status(400).json({message: "User with this email already exists"});
        }

        //Creating a new user and save
        const newUser = await enroll.create([{
            firstName,
            lastName,
            email,
            phoneNo,
            gender,
            learningTrack,
            ATDP
        }]);

  
        await session.commitTransaction(); //commit the transaction
        session.endSession()

        return res.status(201).json({
            message: "User has been enrolled successfully!" 
        })


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}


