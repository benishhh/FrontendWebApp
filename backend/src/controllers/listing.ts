import { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";
import {IListing} from '../models/Listing'
import Listing from "../models/Listing";
import Brand from '../models/Brand';

const listingController = {
    addListing: async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 422,
                    message: errors.array()[0]?.msg,
                },
                mess: errors.array()
            });
        }

        const {
            title,
            description,
            carModel,
            carYear,
            carMileage,
            carEngineType,
            carEngineSize,
            carPrice,
            carSpecifications,
            carDescription,
            sellerId,
            brandId,
        } = req.body;

        try {
            // Sprawdź czy Brand istnieje
            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Brand not found',
                    },
                });
            }

            // Tworzenie nowego listingu
            const newListing: IListing = new Listing({
                title,
                description,
                car: {
                    brand: brandId,
                    carModel,
                    year: carYear,
                    mileage: carMileage,
                    engineType: carEngineType,
                    engineSize: carEngineSize,
                    price: carPrice,
                    specifications: carSpecifications,
                    description: carDescription,
                },
                seller: sellerId,
                likedByUsers: [],
            });

            // Zapisanie nowego listingu
            await newListing.save();

            res.status(201).json({
                success: true,
                data: {
                    newListing
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    },

    deleteListing: async (req: Request, res: Response, next: NextFunction) => {
        const listingId = req.params.id;

        try {
            const listingToDelete = await Listing.findById(listingId);

            if (!listingToDelete) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: 'Listing not found',
                    },
                });
            }

            await listingToDelete.deleteOne();

            res.status(200).json({
                success: true,
                data: {
                    message: 'Listing deleted successfully'
                },
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

    //
    getAllListings: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filters: any = {};

            if (req.query.yearFrom && req.query.yearTo) {
                filters['car.year'] = {$gte: parseInt(req.query.yearFrom as string), $lte: parseInt(req.query.yearTo as string)};
            }

            if (req.query.brandId) {
                filters['car.brand'] = req.query.brandId as string;
            }

            if (req.query.priceFrom && req.query.priceTo) {
                filters['price'] = {$gte: parseFloat(req.query.priceFrom as string), $lte: parseFloat(req.query.priceTo as string)};
            }

            if (req.query.carModel) {
                filters['car.carModel'] = {$regex: new RegExp(req.query.carModel as string, 'i')};
            }

            const listings = await Listing.find(filters);

            res.status(200).json({
                success: true,
                data: {
                    listings
                },
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
    }
}

    export default listingController;