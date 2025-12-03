import { Router } from 'express';

import { getOverallAttendance, getAllStudentWithAttendance, getStudentAttendance, getAttendanceByTrack, getAttendanceByDateRange, getAttendanceByName } from '../controllers/enroll.Controller.js';

import { MarkAttendance, autoMarkabsence } from '../controllers/attendance.controller.js'

import { authMiddleware } from '../middlewares/auth.middleware.js'; 

const attendanceRouter = Router();

attendanceRouter.post('/mark', authMiddleware, MarkAttendance);
attendanceRouter.post('/automarkabsence', authMiddleware, autoMarkabsence);

attendanceRouter.get('/overall-attendance', getOverallAttendance)

attendanceRouter.get('/students-attendance', getAllStudentWithAttendance);

attendanceRouter.get('/students/:id', getStudentAttendance)

attendanceRouter.get('/student-track/:track', getAttendanceByTrack)

attendanceRouter.get('/date-range', getAttendanceByDateRange)

attendanceRouter.get('/student-name/:name', getAttendanceByName);


export default attendanceRouter;