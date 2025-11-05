import { Router } from 'express';
import { EnrollUser } from '../controllers/enroll.Controller.js';


const enrollRouter = Router();

enrollRouter.post('/enroll', EnrollUser)

export default enrollRouter;