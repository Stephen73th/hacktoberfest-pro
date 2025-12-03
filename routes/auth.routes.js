import { Router } from 'express'
import { SignUp, SignIn } from '../controllers/auth.Controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRouter = Router()

authRouter.post('/signup', SignUp, authMiddleware)

authRouter.post('/signin', SignIn, authMiddleware)

authRouter.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({message: `Welcome to your admin dashboard ${req.auth.name}` })
});

export default authRouter;

