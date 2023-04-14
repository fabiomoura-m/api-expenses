import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { ICategory } from './interfaces/category';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const categorias:ICategory[] = loadDatabase('categories');

    res.status(200).json(categorias);
});

export default route;
