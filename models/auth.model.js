import mongoose from 'mongoose'

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength:[3, "name must be at least 5 characters"],
        maxLength:[30, "name must not be more than 30 characters" ]
    },

   email:{
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    minLength: [8, "Email must be at least 8 characters long"],
    maxLength: [30, "Email must not be more than 30 characters"],
    match: [/\S+@\S+\.\S+/, "Email is valid"],
   },

    password: {
          type: String,
         required: [true, "Password is required"],
         minLength: [8, "Password must be atleast 8 characters"],
         maxLenght: [20, "Password must not be more than 20 characters"]
     },


   track:{
    type: String,
    enum: ["Backend Development",
    "Cloud Computing",
    "Fullstack Development",
    "Data Analytics",
    "Cyber Security"],

    required:[true, "Track is required"]
   },
  
}, {timestamps: true})


const auth = mongoose.model("auth", authSchema)
export default auth
