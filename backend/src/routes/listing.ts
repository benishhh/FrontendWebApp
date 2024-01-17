import express from 'express';
import { body } from 'express-validator';
import Listing from '../models/Listing';
import brand from '../controllers/brand';
import listingController from "../controllers/listing";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware";

const listingRouter = express.Router();

listingRouter.get('', listingController.getAllListings);

listingRouter.post('',
    [
        body('title', 'Title is invalid').notEmpty().isString(),
        body('description', 'Description is invalid').notEmpty().isString(),
        body('carModel', 'Car Model is invalid').notEmpty().isString(),
        body('carYear', 'Car Year is invalid').notEmpty().isNumeric(),
        body('carMileage', 'Car Mileage is invalid').notEmpty().isNumeric(),
        body('carEngineType', 'Car Engine Type is invalid').notEmpty().custom(value => {
            const allowedTypes = ['diesel', 'gasoline', 'electric', 'hybrid'];
            if (!allowedTypes.includes(value)) {
                throw new Error('Invalid Car Engine Type');
            }
            return true;
        }),
        body('carEngineSize', 'Car Engine Size is invalid').notEmpty().isFloat({ min: 0 }),
        body('carPrice', 'Car Price is invalid').notEmpty().isFloat({ min: 0 }),
        body('brandId', 'Brand ID is invalid').notEmpty().isString().custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Brand ID');
            }
            return true;
        }),
        body('imageUrl', 'Image URL is invalid').isString()
    ],
    authMiddleware,
    listingController.addListing);

listingRouter.get('/:id', listingController.getListing);

listingRouter.delete('/:id/likes', authMiddleware, listingController.removeFromFavorites);

listingRouter.post('/:id/likes', authMiddleware, listingController.addToFavorites);
export default listingRouter;