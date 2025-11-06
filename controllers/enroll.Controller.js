import mongoose from 'mongoose';
import enroll from '../models/enroll.model.js';

// Mark attendace function 
export const MarkAttendance = async (req, res, next) => {
    try{
        const {email} = req.body;

        // check for empty output
        if (!email){
            return res.status(400).json({message: "Email required"})
        } 
          
        // Check if attendance already marked for today
        const today = new Date();
        console.log("Todays Date", today);

            // Check if today is weekend
            if(isWeekend(today)){
                return res.status(400).json({message: "Attendance can not be marked on weekends"})
            }

         //Validation - check if student enrolled
        const student = await enroll.findOne({email});
         if(!student){
         return res.status(400).json({message: "Student not found!"})
        }
      

        // prevent student from marking attendance
        const startOfDay = getStartOfDay(today)
        const endOfDay = getEndOfDay(today)
        const alreadyMarked = student.attendance.some((record)=>{

            const recordDate = new Date(record.date);
            return recordDate >= startOfDay && recordDate <= endOfDay;
        })

        // This means startOfDay is 0.00 midnight
        //This means endOfDay is 11.59pm
        //so we are creating a time range that represents today only

        if(alreadyMarked){
            return res.status(400).json({message:"Attendance already marked"})
        }

        //. Mark the student present

        student.attendance.push({
            date: today,
            status: "present"

        })

        //Save it
        await student.save();
        return res.status(200).json({
            message: "Attendance marked succesfully!",
            status: "present"
        }) 



    }catch(error){
        

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })

    }

}



// auto mark attendance function 
export const autoMarkabsence = async (req, res, next) => {

    try{

    }catch(error){

    }


    
}

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

// Helper function to prevent attendance marking on saturdays and sundays

const isWeekend = (date) => { //param date: Date object
    const day = date.getDay();
   return day === 0 || day === 6 //0 = Sunday, 6 = Saturday
}

// Helper function to know the start of the day
const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    return start;
}
// Helper function to know the end of the day
const getEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23,59,59,999);
    return end;
}
