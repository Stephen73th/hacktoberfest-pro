import mongoose from 'mongoose';
import enroll from '../models/enroll.model.js';




//Get overall attendance function
export const getOverallAttendance = async (req, res, next) => {
   try{

    const students = await enroll.find({});

    if (students.length === 0) {
        return res.status(404).json({message: "No students found"})
    }
    // This stores the total number of present and absent days for all students
    let totalPresent = 0;
    let totalAbsent = 0;

    //This array holds each student attendance summary

    const summaries = [];

     // Loop through each student to calculate their attendance data

     students.forEach((student) => {
        // Count number of days they were present
        const presentDays = student.attendance.filter(
            record => record.status === "present"
        ).length;

        // Count number of days they were absent
        const absentDays = student.attendance.filter(
            record => record.status === "absent"
        ).length;

         
        // Total number of attendance records for this student

        const totalDays = presentDays + absentDays;

        //Calculate attendance percentage (avoid division by zero)

        const percentage = totalDays === 0 ? 0 : ((presentDays / totalDays) * 100);

        //Add this student's count to the general totals 

        totalPresent += presentDays;
        totalAbsent += absentDays;


        // Store individual student summary
        summaries.push({
            studentId: student._id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            gender: student.gender,
            learningTrack: student.learningTrack,
            presentDays,
            absentDays,
            attendancePercentage: percentage
        });

     });

      // Find student with the highest attendance percentage

      const best = summaries.reduce(
        (max, student) => 
            student.attendancePercentage > max.attendancePercentage ? student : max, summaries[0]
        );

       // Find student with the lowest attendance percentage

       const worst = summaries.reduce(
        (min, student) => 
        student.attendancePercentage < min.attendancePercentage ? student : min, summaries[0]
        );

       // Calculate averaGge attendance of all students 
       const averageAttendance = summaries.reduce((sum, student) => sum + student.attendancePercentage, 0) / summaries.length;

       // Send final report to client (admin)
       return res.status(200).json({
        totalStudents: students.length,
        totalPresent,
        totalAbsent,
        averageAttendance,
        bestAttendance: best,
        worstAttendance: worst,
        summaries
    })


   }catch(error){
    console.error('Error in getOverallAttendance:', error);
    return res.status(500).json({message: 'Something went wrong', error: error.message})

   } 
}

// Get all student with attendance
export const getAllStudentWithAttendance = async (req, res, next) => {

    try{

        const students = await enroll.find({});

        const result = students.map((student) => ({
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            learningTrack: student.learningTrack, attendancePercentage: student.getAttendancePercentage(),
            totalRecords: student.attendance.length,
        }));

        return res.status(200).json({ students: result })

    }catch(error){
        // console.error('Error in getAllStudentWithAttendance:', error )
        return res.status(500).json({message: 'Something went wrong', error: error.message})

    }
    
}

//Get student attendance
export const getStudentAttendance = async (req, res, next) => {


    try{
        // Get the student's id from URL parameters
        const { id } = req.params;

        // Find the student in the database using their ID

        const student = await enroll.findOne({ _id: id });

        // If no student was found, send a "Not Found" response

        if (!student){
            return res.status(404).json({ message: "Student not found!"});
        }

        // Count how many students was marked present

        const totalPresent = student.attendance.filter(
            record => record.status === "present"
        ).length;



        
        //Count how many times the student was marked absent

        const totalAbsent = student.attendance.filter(
        record => record.status === "absent"
        ).length;
        
        // Add present and absent days to get total attendance days

        const totalDays = totalPresent + totalAbsent;

        //Calculate attendance percentage
        //If the student has no attendance records, return 0

        const percentage = totalDays === 0 ? 0 : ((totalPresent / totalDays) * 100);

        //Send the final response back to the client

        return res.status(200).json({
        name: `${student.firstName} ${student.lastName}`, //student fullname
        presentDays: totalPresent, //number of present days
        absentDays: totalAbsent,//number of absent days
        percentage, // Attendance percentage
        attendanceHistory: student.attendance, //Full attendance records
        })

    }catch(error){
        //Handle expected server errors 
        return res.status(500).json({message: "Something went wrong", error: error.message})

    }

    
}

export const getAttendanceByTrack = async (req, res, next) => {

    try{
        // Replace hyphens with spaces "backend-development" becomes "backend development"
        const track = req.params.track.replace(/-/g, " ");

        //Find students in this specific learning track

        const students = await enroll.find({
            learningTrack: new RegExp(`${track}$`, "i")
        });

        //If no student found, return an error response
        if (students.length === 0){
            return res.status(404).json({message: "No students found for this track!"})
        }

        //Prepare for the result for each student in the track 
        const result = students.map((student) => {

        // Count how many times the student was marked present
        const presentDays = student.attendance.filter(
            (attendance) => attendance.status === "present"
        ).length;

        //Count how many times the student was marked absent
        const absentDays = student.attendance.filter(
            (attendance) => attendance.status === "absence"
        ).length;
        //Total number of days recorded for this student
        const totalDays = presentDays + absentDays;

        // Return structured attendance data for this student
        return {
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            track: student.track,
            presentDays,
            absentDays,
            percentage: student.getAttendancePercentage()

        }  
        });
        // Send the final response with all students' attendance in this track
        return res.status(200).json({
            message: `Attendance for track: ${track} fetched successfully`,
            count: result.length,
            data: result
        })
      
        

    }
    catch(error){
        //Catch any server side error and return a 500  response3
        res.status(500).json({message: "Something went wrong", error: error.message})

    }
    
}

export const getAttendanceByDateRange = async (req, res, next) => {
    try{

        //This line gets the query strings

        const {range, start, end} = req.query

        //api/v1/attendance/filter?range=7days
        let startDate , endDate = new Date()
        endDate.setHours(23,59,59,999)

        if(range && range !== "custom"){
            const number = parseInt(range)
            const unit = range.slice(-1) //extracts the alphabet 'd', 'w'

            if(unit === 'd'){
                startDate = new Date()
                startDate.setDate(startDate.getDate() - number * 7)
            

            }else{
                return res.status(400).json({message: "Invalid date format, try again"})
            }

        }


        if(range === 'custom'){
            if(!start || !end){
                return res.status(400).json({message: "Start and End dates are required"})
            }

            // Convert the start and strings into date objects
            startDate = new Date(start);
            endDate = new Date(end);

            endDate.setHours(23, 59, 59, 999)
        }


        if(!startDate){
            return res.status(400).json({message: "start date is missing"})

        }

        const students = await enroll.find({}, {
            firstName: 1,
            lastName: 1,
            email: 1,
            gender:1,
            learningTrack:1,
            attendance: 1


        })

        const findStudents = students.map(student => {
            const filteredStudents = student.attendance.filter(record => {
                const recordDate = new Date(record.date)
                return recordDate <= endDate
            })

            if(filteredStudents.length > 0){
                return {
                    name : `${student.firstName} ${student.lastName}`,
                    email : student.email,
                    learningTrack : student.learningTrack,
                    gender : student.gender,
                    attendanceCount : filteredStudents.length, 
                    present : filteredStudents.filter(s => s.status === "present").length,
                    absent : filteredStudents.filter(s => s.status === "absent").length,
                    records: filteredStudents
                }
            }
            
            //Return null for students without attendance in this date range
            return null;
        })
        //Remove null entries from the array
        .filter(Boolean)

        // Send success response with total count and filtered student data

        return res.status(200).json({
            message: "Students fetched succesfully",
            attendanceCount: findStudents.length,
            data: findStudents
        });


    }catch(error){
        // Handle server errors
        return res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
    
}

export const getAttendanceByName = async (req, res, next) => {
    try{

        // Extract the "name" parameter from the URL
        const { search } = req.query;

        //If no name was provided in the request, return an error
        if (!search) {
            return res.status(400).json({message: "searh key is required"});
        };

        // Search for a student using a case-insensitive match

        const regex = new RegExp(search, "i");
        const students = await enroll.find({
            $or: [
                {firstName: regex},
                {lastName: regex}
            ]
        },
        {
            firstName: 1,
            lastName: 1,
            email: 1,
            gender: 1,
            learningTrack: 1,
            attendance: 1,
        }
    
    )
    if (students.length === 0){
        return res.status(404).json({message: "Name is not on the database"})
    }

    //Prepare the result for each student found

    const results = students.map(student => ({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        gender: student.gender,
        learningTrack: student.learningTrack,
        attendanceCount: student.attendance.length,
        presence: student.attendance.filter(s => s.status === "present").length,
        absence: student.attendance.filter(s => s.status === "absent").length,
        records: student.attendance
    }));

    res.status(200).json({message: "Attendance filtered by name successfully.",
        count: results.length,
        data: results
    });

    } catch(error){

        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message});

    }
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


