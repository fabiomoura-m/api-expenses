import Joi from 'joi';
import { IBodyUser } from '../interfaces/user';


export const bodySchemaUser: Joi.ObjectSchema<IBodyUser> = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
});

