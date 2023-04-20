import Joi from 'joi';
import { IBodyCategory } from '../interfaces/category';

export const bodyCategorySchema: Joi.ObjectSchema<IBodyCategory> = Joi.object({
    name: Joi.string().required()
});

export const bodySchema = {
    name: 'string'
};
