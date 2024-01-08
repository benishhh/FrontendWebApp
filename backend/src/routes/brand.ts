import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import brand from '../controllers/brand';
import brandController from "../controllers/brand";

const brandRouter = express.Router();

brandRouter.get('', brandController.getBrands);

brandRouter.post('',
    [
        body('name').notEmpty().withMessage("name is mandatory")
            .isString().withMessage("name has to be string")
    ],
    brandController.addBrand
);

brandRouter.delete('/:id', brandController.deleteBrand);

brandRouter.put('/:id',
    brandController.updateBrand);

brandRouter.post('/:id/carModels',
    [
        body('carModel').not().isEmpty().withMessage("carModel is mandatory")
            .isString().withMessage("carModel has to be string")
    ],
    brandController.addCarModel);

brandRouter.delete('/:id/carModels', [
        body('carModel').not().isEmpty().withMessage("carModel is mandatory")
            .isString().withMessage("carModel has to be string")
    ],
    brandController.deleteCarModel);


export default brandRouter;