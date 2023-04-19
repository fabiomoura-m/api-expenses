import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { IBodyCategory, ICategory } from './interfaces/category';
import { bodyCategorySchema, bodySchema } from './schemas/categories';
import messages from './enums/messages';
import generateRandomNumber from './utils/generateRandomId';
import saveDataInJson from './utils/saveDataInJson';
import { IExpense } from './interfaces/expense';
import { IUser } from './interfaces/user';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const categorias: ICategory[] = loadDatabase('categories');

    res.status(200).json(categorias);
});

route.get('/:categoryID', (req: Request, res: Response) => {
    const categorias: ICategory[] = loadDatabase('categories');
    const id = req.params.categoryID;

    const categoria = categorias.find(item => item.id === id);

    if (!categoria) {
        res.status(404).json({ message: messages.categoryNotFound });
    }

    res.status(200).json(categoria);
});

route.post('/', (req: Request, res: Response) => {
    const categories: ICategory[] = loadDatabase('categories');
    const body: IBodyCategory = req.body;

    const { error } = bodyCategorySchema.validate(body);

    if (error) {
        return res.status(400).json({
            message: messages.invalidBody,
            BodyExpected: bodySchema
        });
    }
    const randomNumber = generateRandomNumber();
    const newID = `cat_${randomNumber}`;
    const newCategory = {
        id: newID,
        name: body.name
    };
    categories.push(newCategory);
    saveDataInJson(categories, 'categories');
    return res.status(200).json(newCategory);
});

route.put('/:categoryID', (req: Request, res: Response) => {
    const categories: ICategory[] = loadDatabase('categories');
    const expenses: IExpense[] = loadDatabase('expenses');
    const users: IUser[] = loadDatabase('users');
    const idCategory = req.params.categoryID;
    const body: IBodyCategory = req.body;

    let categoryIndex = categories.findIndex(
        category => category.id === idCategory
    );

    if (categoryIndex === -1) {
        return res.status(404).json({ message: messages.categoryNotFound });
    }

    const { error } = bodyCategorySchema.validate(body);
    if (error) {
        return res.status(400).json({
            message: messages.categoryNotUpdated,
            BodyExpected: bodySchema
        });
    }

    categories[categoryIndex].name = body.name;

    expenses.forEach(expense => {
        if (expense.categoryID === idCategory) {
            expense._category.name = body.name;
        }
    });

    users.forEach(user => {
        user._expenses.forEach(expense => {
            if (expense.categoryID === idCategory) {
                expense._category.name = body.name;
            }
        });
    });

    saveDataInJson(categories, 'categories');
    saveDataInJson(expenses, 'expenses');
    saveDataInJson(users, 'users');

    res.status(200).json(categories[categoryIndex]);
});

route.delete('/:categoryID', (req: Request, res: Response) => {
    let categories: ICategory[] = loadDatabase('categories');
    let expenses: IExpense[] = loadDatabase('expenses');
    let users: IUser[] = loadDatabase('users');
    const { categoryID } = req.params;

    const categoryIndex = categories.findIndex(
        categorie => categorie.id === categoryID
    );

    if (categoryIndex === -1) {
        res.status(404).json({ message: messages.categoryNotFound });
    }

    expenses = expenses.filter(expense => expense.categoryID !== categoryID);

    categories.splice(categoryIndex, 1);

    users.forEach(user => {
        const newExpenses = user._expenses.filter(
            expense => expense.categoryID !== categoryID
        );
        user._expenses = newExpenses;
    });

    saveDataInJson(categories, 'categories');
    saveDataInJson(expenses, 'expenses');
    saveDataInJson(users, 'users');

    res.status(204).json();
});

export default route;
