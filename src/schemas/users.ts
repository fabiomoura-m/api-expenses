import Joi from 'joi';
import { IBodyPostUser } from '../interfaces/user';


export const bodyPostSchema: Joi.ObjectSchema<IBodyPostUser> = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
});