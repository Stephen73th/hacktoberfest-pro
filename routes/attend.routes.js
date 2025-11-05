import { Router } from 'express';
import { AttendUser } from '../controllers/attend.Controller.js';

const attendRouter = Router();

attendRouter.post('/attend', AttendUser)

export default attendRouter;