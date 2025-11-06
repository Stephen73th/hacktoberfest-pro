import mongoose from 'mongoose'


const attendanceSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum: ['present', 'absent'],
        required: true,
    }

},

{
    _id: false //not verified yet
 
}

)

const enrollSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "name must be at least 5 characters"],
        maxLength: [30, "name must not be more than 30 characters"]
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "name must be at least 5 characters"],
        maxLength: [30, "name must not be more than 30 characters"]
    },

    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
        minLength: [8, "Email must be at least 8 characters long"],
        match: [/\S+@\S+\.\S+/, "Email is valid"],
    },

    phoneNo: {
        type: Number,
        required: [true, "Phone number is required"],
        minLength: [10, "Phone number must be atleast 10 characters"],
        match: [/^\+[1-9]\d{1,14}$/, "Phone number is valid"],
    },
    gender: {
        type: String,
        enum: [
            "Male",
            "Female"
        ],
        required: true

    },

    learningTrack: {
        type: String,
        enum: ["Backend Development",
            "Cloud Computing",
            "Fullstack Development",
            "Data Analytics",
            "Cyber Security"],

        required: [true, "Track is required"]
    },

    attendance:{
        type: [attendanceSchema],
        default: []
    }

}, { timestamps: true }

)

//setting enroll schema to index 1 (ascending order) helping to search faster using index

enrollSchema.index({email: 1});
enrollSchema.index({"attendance.date": 1})


//A virtual name: combining first name and lastname to search faster using fullname
enrollSchema.virtual("fullname").get(function(){
    return `${this.firstName} ${this.lastName}`
}) // 'this' now represents enrollment schema

enrollSchema.methods.getAttendancePercentage = function (){
    // step 1: Check if student has any attendance record
    if (this.attendance.lenght === 0) return 0;

    // step 2: Count how many times they were present
    const presentCount = this.attendancee.filter((record) => record.status === "present").length;


    //Step 3: Calculate the percentage
    // Formula: (present days / total days) * 100

    return ((presentCount / this.attendance.length) * 100). toFixed(2)


}

//Method to get attendance by date range

enrollSchema.methods.getAttendancePercentage = function (startDate, endDate){
    return this.attendance.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
    })

};

enrollSchema.statics.findLowAttendanceStudents = async function (threshold = 75){
    //step 1: Get all students from database
    const students = await this.find({});

    // Step 2:  Filter all students with attendance below threshold
    return students.filter((student) => {
            const percentage = student.getAttendancePercentage();
            return parseFloat(percentage) < threshold;
    })
} 



const enroll = mongoose.model("enroll", enrollSchema)
export default enroll;

