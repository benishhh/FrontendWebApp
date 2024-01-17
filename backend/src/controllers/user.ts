import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import User from '../models/User';
import {validationResult} from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import {IUser} from '../models/User'

const userController = {
    register: async (req: Request, res: Response) => {
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

            return res.status(201).json({
                success: true,
                data: {
                    newUser,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },


    login: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: 'Invalid email or password',
                    },
                });
            }

            const token = generateJWTToken(user);
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },

    getLoggedInUser: async (req: Request, res: Response) => {
        try {
            // Używamy informacji z req.user, które zostały dodane przez middleware autentykacji
            const user = await User.findById((req as any).user._id).select('-password'); // Nie zwracamy hasła

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'User not found',
                    }
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                }
            });
        }
    },

    getUserFavouriteListings: async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user._id; // Pobranie ID użytkownika z zapytania (zakładając, że jest już uwierzytelniony)

        try {
            const user = await User.findById(userId).populate({
                path: 'likedListings',
                populate: {
                    path: 'car.brand',
                    model: 'Brand'
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'User not found',
                    },
                });
            }

            const favoriteListings = user.likedListings;

            return res.status(200).json({
                success: true,
                data: {
                    listings: favoriteListings
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },

    getUserListings: async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user._id;

        try {
            const user = await User.findById(userId).populate({
                path: 'listings',
                populate: {
                    path: 'car.brand',
                    model: 'Brand'
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'User not found',
                    },
                });
            }

            const userListings = user.listings;

            return res.status(200).json({
                success: true,
                data: {
                    listings: userListings
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    }
}

const generateJWTToken = (user: IUser) => {
    const secretKey = String(process.env['JWTSecretKey']);
    const expiresIn = '5h';

    return jwt.sign({ user: {
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            themeMode: user.themeMode,
            }},
        secretKey,
        { expiresIn });
};

export default userController;