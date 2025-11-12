
import express from 'express';
import { connectDB } from './database/mongodb.js';
import { PORT } from './config/env.js'
import authRouter from './routes/auth.routes.js';
import enrollRouter from './routes/enroll.routes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';    
import attendanceRouter  from './routes/attendance.routes.js';
import { autoMarkabsence } from './controllers/attendance.controller.js';

// Schedule the autoMarkabsence function to run every day at 2:00 PM



dotenv.config();
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],

}))
app.use(express.urlencoded({ extended: true}))



app.use('/api/v1/auth', authRouter);
app.use('/api/v1', enrollRouter);
app.use('/api/v1/', attendanceRouter)
app.use('/api/v1/', attendanceRouter)

cron.schedule('59 23 * * *', async () => {
    console.log("Testing cron job for auto marking absence")
    await autoMarkabsence(null, null);
});


app.listen(PORT, () => { 
    connectDB()
    console.log(`Server is running`)
})

export default app;
