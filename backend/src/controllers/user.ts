import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import User from '../models/User';
import {validationResult} from "express-validator";

const userController = {
    registerUser: async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0].msg,
                }
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            res.status(201).json({
                success: true,
                data: newUser,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },
}

export default userController;