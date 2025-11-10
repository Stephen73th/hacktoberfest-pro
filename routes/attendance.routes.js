import { Router } from 'express';

import { MarkAttendance, autoMarkabsence } from '../controllers/attendance.controller.js';

const attendanceRouter = Router();

attendanceRouter.post('/mark', MarkAttendance);
attendanceRouter.post('/automarkabsence', autoMarkabsence);


export default attendanceRouter;