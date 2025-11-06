
import enroll from '../models/enroll.model.js';


// Helper function to prevent attendance marking on saturdays and sundays

const isWeekend = (date) => { //param date: Date object
    const day = date.getDay();
   return day === 0 || day === 6 //0 = Sunday, 6 = Saturday
}

// Helper function to know the start of the day
const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(9,0,0,0);
    return start;
}
// Helper function to know the end of the day
const getEndOfDay = (date) => {
    const end = new Date(date);
    end.setHours(13,59,59,999);
    return end;
}

// auto mark attendance function 
export const autoMarkabsence = async (req, res, next) => {

    try{

        //Helps to get todays date and time

        const today = new Date();

        // Check if today is weekend
        if(isWeekend(today)){
            const message = "Today is weekend, no auto-marking of attendance";
            console.log(message);

            if(res){
                return res.status(200).json({message})
             }
             return;

        }

        // These two logics helps to check if the current time is between 9am - 1:59pm

        const Daybegins = getStartOfDay(today);
        const DayEnds = getEndOfDay(today);

        // This will return all the list of the students in the database

        const students = await enroll.findOne({})

        //Looping through the list of student to check how many students are present or absent

        let MarkedCount = 0;

        for(const student of students){

            // Check if student has already marked attendance for today or not
            const markToday = student.attendance.some((record) => { //loop through attendance records
                // get the date from the  record
                const recordDate = new Date(record.date)

                //Check if the record date is within today 
                return ( record.status === "present" &&
                    recordDate >= Daybegins && recordDate <= DayEnds);


            })
            // If attendance is not marked today, mark them absent
            if(!markToday){
                student.attendance.push({
                    date:today,
                    status: "absent"
                });
                await student.save();
                MarkedCount++;
                console.log(`Auto marked ${student.email} as absent for today ${today.toDateString()}`);
            }


        };
            const message = `The total number of students auto marked as absent today is ${MarkedCount}`;
            console.log(message);
        


    } catch(error){
        

    }


    
}



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