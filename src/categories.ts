import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { IBodyPostCategory, ICategory } from './interfaces/category';
import { bodyPostSchema } from './schemas/categories';
import messages from './enums/messages';
import generateRandomNumber from './utils/generateRandomId';
import saveDataInJson from './utils/saveDataInJson';

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

route.post('/', (req: Request, res: Response) => {
    const categories: ICategory[] = loadDatabase('categories');
    const body: IBodyPostCategory = req.body;

    const { error } = bodyPostSchema.validate(body);

    if (error) {
        return res.status(400).json({
            message: messages.invalidBody,
            BodyExpected: {
                name: 'string',
            }
        });
    }
    const randomNumber = generateRandomNumber();
    const newID = `cat_${randomNumber}`;
    const newCategory = {
        id:newID, name:body.name
    }
    categories.push(newCategory);
    saveDataInJson(categories, 'categories');
    return res.status(200).json(newCategory)


    
})
export default route;
