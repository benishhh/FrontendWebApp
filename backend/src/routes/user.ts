import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import userController from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/register',
    [
        body('email').isEmail().withMessage('Email has to be email format.')
            .custom(async (value, { req: Request}) => {
            const existingUser = await User.findOne({ email: value });
            if(existingUser) {
                throw new Error('There is a user with this email address.')
            }
        }),
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
    ],
    userController.register
    )

userRouter.post('/login', userController.login)


export default userRouter;