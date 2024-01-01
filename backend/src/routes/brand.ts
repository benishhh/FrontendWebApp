import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import brand from '../controllers/brand';
import brandController from "../controllers/brand";

const brandRouter = express.Router();

brandRouter.post('',
    [
        body('name').not().isEmpty().withMessage("name is mandatory")
    ],
    brandController.addBrand
);

brandRouter.delete('/:id', brandController.deleteBrand);


export default brandRouter;