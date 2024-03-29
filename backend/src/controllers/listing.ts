import { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";
import {IListing} from '../models/Listing'
import Listing from "../models/Listing";
import Brand from '../models/Brand';
import User from "../models/User";
import mongoose from "mongoose";

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
            brandId,
            imageUrl,
        } = req.body;

        const sellerId = (req as any).user._id;

        try {
            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
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
                },
                imageUrl: imageUrl,
                seller: sellerId,
                likedByUsers: [],
            });

            // Zapisanie nowego listingu
            await newListing.save();

            // Aktualizacja listingu w profilu użytkownika
            await User.findByIdAndUpdate(sellerId, {
                $push: { listings: newListing._id } // Dodanie ID listingu do tablicy listings użytkownika
            });


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
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
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

            const listings = await Listing.find(filters)
                .populate('car.brand', 'name')  // Zastąpienie ID marki samochodu nazwą marki
                .populate('seller', 'username') // Zastąpienie ID sprzedawcy jego nazwą użytkownika
                .populate('likedByUsers', 'username'); // Zastąpienie ID użytkowników, którzy polubili, ich nazwami użytkowników

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
    },

    addToFavorites: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listingId = req.params.id;
            const userId = (req as any).user._id;
            console.log(userId);
            console.log(listingId);

            const user = await User.findById(userId);
            if (user?.likedListings.includes(new mongoose.Types.ObjectId(listingId))) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Listing is already in favorites',
                    },
                });
            }
            user?.likedListings.push(new mongoose.Types.ObjectId(listingId));
            await user?.save();

            await Listing.findByIdAndUpdate(listingId, { $push: { likedByUsers: userId } });

            return res.status(200).json({
                success: true,
                data: {
                    message: 'Listing added to favorites',
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

    removeFromFavorites: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listingId = req.params.id;
            const userId = (req as any).user._id;

            const listingObjectId = new mongoose.Types.ObjectId(listingId);
            const userObjectId = new mongoose.Types.ObjectId(userId);

            await User.findByIdAndUpdate(userId, { $pull: { likedListings: listingObjectId } });
            await Listing.findByIdAndUpdate(listingId, { $pull: { likedByUsers: userObjectId } });

            return res.status(200).json({
                success: true,
                data: {
                    message: 'Listing removed from favorites',
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

    getListing: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listingId = req.params.id;
            const listing = await Listing.findById(listingId).populate('car.brand', 'name').populate('seller', 'username');

            if (!listing) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: 'Listing not found',
                    },
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    listing: listing
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
}

    export default listingController;