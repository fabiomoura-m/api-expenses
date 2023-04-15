import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import {
    IBodyPostExpense,
    IExpense,
    IExpenseForUser
} from './interfaces/expense';
import { ICategory } from './interfaces/category';
import { IUser } from './interfaces/user';
import generateRandomNumber from './utils/generateRandomId';
import { bodyPostSchema } from './schemas/expenses';
import messages from './enums/messages';
import saveDataInJson from './utils/saveDataInJson';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const expenses = loadDatabase('expenses');

    res.status(200).json(expenses);
});

route.get('/:id', (req: Request, res: Response) => {
    const expenses: IExpense[] = loadDatabase('expenses');
    const id = req.params.id;

    const expense = expenses.find(item => item.id === id);

    if (!expense) {
        res.status(404).json({ message: messages.expenseNotFound });
    }

    res.status(200).json(expense);
});

route.post('/', (req: Request, res: Response) => {
    const expenses: IExpense[] = loadDatabase('expenses');
    const categories: ICategory[] = loadDatabase('categories');
    const users: IUser[] = loadDatabase('users');
    const body: IBodyPostExpense = req.body;

    const { error, value } = bodyPostSchema.validate(body);

    if (error) {
        return res.status(400).json({
            message: messages.invalidBody,
            BodyExpected: {
                name: 'string',
                categoryID: 'string',
                userID: 'string',
                amount: 'number'
            }
        });
    }

    const { categoryID, userID } = body;
    const existCategory = categories.find(
        category => category.id === categoryID
    );
    const existUser = users.find(user => user.id === userID);
    const indexUser = users.findIndex(user => user.id === userID);

    if (existCategory && existUser) {
        const { id, name, lastName, email } = existUser;
        const randomNumber = generateRandomNumber();
        const newID = `exp_${randomNumber}`;
        const newExpense: IExpense = {
            id: newID,
            ...body,
            status: 'PENDENTE',
            _user: {
                id,
                name,
                lastName,
                email
            },
            _category: {
                ...existCategory
            }
        };

        const newExpenseForUser: IExpenseForUser = {
            id: newID,
            ...body,
            status: 'PENDENTE',
            _category: {
                ...existCategory
            }
        };

        (users[indexUser]._expenses).push(newExpenseForUser);
        expenses.push(newExpense);

        saveDataInJson(expenses, 'expenses');
        saveDataInJson(users, 'users');

        return res.status(200).json(newExpense);
    } else {
        return res
            .status(400)
            .json({ message: messages.invalidIdUserOrCategory });
    }
});

export default route;
