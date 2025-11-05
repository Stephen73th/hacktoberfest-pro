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
        unique: true,
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

}, { timestamps: true })


const enroll = mongoose.model("enroll", enrollSchema)
export default enroll;

