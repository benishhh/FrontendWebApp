import express from 'express';
import { body } from 'express-validator';
import Listing from '../models/Listing';
import brand from '../controllers/brand';
import listingController from "../controllers/listing";
import mongoose from "mongoose";

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
        body('carSpecifications', 'Car Specifications is invalid').notEmpty().isString(),
        body('carDescription', 'Car Description is invalid').isString(),
        body('sellerId', 'Seller ID is invalid').notEmpty().isString().custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Seller ID');
            }
            return true;
        }),
        body('brandId', 'Brand ID is invalid').notEmpty().isString().custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Brand ID');
            }
            return true;
        })
    ],
    listingController.addListing);

listingRouter.delete('/:id', listingController.deleteListing)
export default listingRouter;