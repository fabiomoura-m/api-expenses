import Joi from 'joi';
import { IBodyPostCategory } from '../interfaces/category';

export const bodyPostSchema: Joi.ObjectSchema<IBodyPostCategory> = Joi.object({
    name: Joi.string().required()
});
