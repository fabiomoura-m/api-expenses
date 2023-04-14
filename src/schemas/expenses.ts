import Joi from 'joi';
import { IBodyPostExpense } from '../interfaces/expense';

export const bodyPostSchema: Joi.ObjectSchema<IBodyPostExpense> = Joi.object({
    name: Joi.string().required(),
    categoryID: Joi.string().required(),
    userID: Joi.string().required(),
    amount: Joi.number().strict().required()
});
