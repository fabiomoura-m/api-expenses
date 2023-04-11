import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const users = loadDatabase('users');

    res.json(users);
});

export default route;
