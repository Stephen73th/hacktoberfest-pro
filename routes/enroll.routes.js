import { Router } from 'express';
import { EnrollUser } from '../controllers/enroll.Controller.js';
import { MarkAttendance  } from '../controllers/enroll.Controller.js';


const enrollRouter = Router();


enrollRouter.post('/enroll', EnrollUser);
enrollRouter.post('/markattendance', MarkAttendance)


export default enrollRouter;