import Joi from 'joi';
import {
    IBodyPostExpense,
    IBodyUpdateExpense,
    IExpense
} from '../interfaces/expense';

export const bodyPostSchema: Joi.ObjectSchema<IBodyPostExpense> = Joi.object({
    name: Joi.string().required(),
    categoryID: Joi.string().required(),
    userID: Joi.string().required(),
    amount: Joi.number().strict().required()
});

export const bodyUpdateSchema: Joi.ObjectSchema<IBodyUpdateExpense> =
    Joi.object({
        name: Joi.string(),
        categoryID: Joi.string().required(),
        userID: Joi.string().required(),
        amount: Joi.number().strict(),
        status: Joi.string().valid('PAGO', 'PENDENTE')
    });

export const bodyExpectedPutSchema = {
    name: 'string',
    categoryID: 'string',
    userID: 'string',
    amount: 'number',
    status: 'PAGO | PENDENTE'
};
