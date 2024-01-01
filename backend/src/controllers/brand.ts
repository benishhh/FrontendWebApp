import { Request, Response, NextFunction } from "express";
import Brand from '../models/Brand'
import {validationResult} from "express-validator";
import {IBrand} from '../models/Brand'
import User from "../models/User";

const brandController = {
    addBrand: async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0]?.msg,
                }
            });
        }

        try {
            const newBrand = await Brand.create({
                name,
                carModels: [],
            });
            return res.status(201).json({
                    success: true,
                    data: {
                        newBrand
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

    deleteBrand: async (req: Request, res: Response, next: NextFunction) => {
        const brandId = req.params.id;

        try {
            const brandToDelete = await Brand.findById(brandId);
            if (!brandToDelete) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Brand not found',
                    },
                });
            }

            await brandToDelete.deleteOne();

            return res.status(200).json({
                success: true,
                data: {
                    message: 'Brand deleted successfully',
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
    }
}

export default brandController;