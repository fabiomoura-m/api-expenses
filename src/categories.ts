import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const categorias = loadDatabase('categories');

    res.json(categorias);
});

export default route;
