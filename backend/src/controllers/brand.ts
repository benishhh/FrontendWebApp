import { Request, Response, NextFunction } from "express";
import Brand from '../models/Brand'
import {validationResult} from "express-validator";
import {IBrand} from '../models/Brand'
import User from "../models/User";

const brandController = {

    getBrands: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const brands = await Brand.find();

            return res.status(200).json({
                success: true,
                data: {
                    brands,
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
                data: {message: 'Brand deleted successfully' },
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

    updateBrand: async (req: Request, res: Response, next: NextFunction) => {
        const brandId = req.params.id;
        const { name, carModels } = req.body;
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
            const brandToUpdate = await Brand.findById(brandId);
            if (!brandToUpdate) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Brand not found',
                    },
                });
            }

            brandToUpdate.name = name || brandToUpdate.name;
            brandToUpdate.carModels = carModels || brandToUpdate.carModels;

            await brandToUpdate.save();

            return res.status(200).json({
                success: true,
                data: {
                    updatedBrand: brandToUpdate,
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

    addCarModel: async (req: Request, res: Response, next: NextFunction) => {
        const brandId = req.params.id;
        const { carModel } = req.body;
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
            const brandToUpdate = await Brand.findById(brandId);
            if (!brandToUpdate) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Brand not found',
                    },
                });
            }

            if(brandToUpdate.carModels.includes(carModel)) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 409,
                        message: 'This brand already contains this model',
                    },
                });
            }

            brandToUpdate.carModels.push(carModel);
            await brandToUpdate.save();

            return res.status(200).json({
                success: true,
                data: {
                    updatedBrand: brandToUpdate,
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

    deleteCarModel: async (req: Request, res: Response, next: NextFunction) => {
        const brandId = req.params.id;
        const { carModel } = req.body;
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
            const brandToUpdate = await Brand.findById(brandId);
            if (!brandToUpdate) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Brand not found',
                    },
                });
            }

            brandToUpdate.carModels = brandToUpdate.carModels.filter(model => model !== carModel);
            await brandToUpdate.save();

            return res.status(200).json({
                success: true,
                data: {
                    updatedBrand: brandToUpdate,
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
}

export default brandController;