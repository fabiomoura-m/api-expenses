import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { ICategory } from './interfaces/category';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const categorias:ICategory[] = loadDatabase('categories');

    res.status(200).json(categorias);
});

route.get('/:categoryID', (req: Request, res: Response) => {
    const categorias:ICategory[] = loadDatabase('categories');
    const id = req.params.categoryID;

    const categoria = categorias.find(item => item.id === id);

    if(!categoria){
        res.status(404).json({message: 'Categoria não encontrada'})
    }

    res.status(200).json(categoria);
});
export default route;
