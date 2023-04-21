import express, { request, response } from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { searchUser } from './utils/searchUser';
import { IUser } from './interfaces/user';
import { bodySchemaUser } from './schemas/users';
import messages from './enums/messages';
import generateRandomNumber from './utils/generateRandomId';
import saveDataInJson from './utils/saveDataInJson';
import { IExpense } from './interfaces/expense';
import { ICategory, ICategoryWithExpenses } from './interfaces/category';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    return res.status(200).json(users);
});

route.get('/:id', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    let categories: ICategory[] = loadDatabase('categories');
    const id: string = req.params.id;
    const user = searchUser(id, users);
    if (user == undefined) {
        return res.status(404).json({ message: messages.userNotFound });
    }

    const categoriesWithExpenses: ICategoryWithExpenses[] = categories.map(
        category => {
            return {
                ...category,
                _expenses: []
            };
        }
    );

    user._expenses.forEach(expense => {
        const category = categoriesWithExpenses.find(
            category => category.id === expense.categoryID
        );
        if (category) {
            category._expenses.push(expense);
        }
    });

    const newUserWithCategories = {
        ...user,
        _categories: [...categoriesWithExpenses]
    };

    return res.status(200).json(newUserWithCategories);
});

route.post('/', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    const data = req.body;
    const randomNumber = generateRandomNumber();
    const newID = `user_${randomNumber}`;
    const newUser: IUser = {
        id: newID,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        _expenses: []
    };

    const { error } = bodySchemaUser.validate(data);

    if (error) {
        return res.status(400).json({ message: messages.invalidBody });
    }
    users.push(newUser);
    saveDataInJson(users, 'users');
    res.status(200).json({
        id: newID,
        name: data.name,
        lastName: data.lastName,
        email: data.email
    });
});

route.put('/:userID', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    const expenses: IExpense[] = loadDatabase('expenses');
    const data = req.body;
    const userID: string = req.params.userID;
    const user = users.find(user => user.id == userID);

    if (!user) {
        return res.status(404).json({ message: messages.userNotFound });
    }
    const newUser = {
        id: user.id,
        name: data.name ?? user.name,
        lastName: data.lastName ?? user.lastName,
        email: data.email ?? user.email,
        _expenses: user._expenses
    };
    const indexUser = users.findIndex(user => user.id == userID);
    users[indexUser] = newUser;

    const newUserForExpense = {
        id: user.id,
        name: data.name ?? user.name,
        lastName: data.lastName ?? user.lastName,
        email: data.email ?? user.email
    };

    expenses.forEach(expense => {
        if (expense.userID === userID) {
            expense._user = newUserForExpense;
        }
    });

    saveDataInJson(expenses, 'expenses');
    saveDataInJson(users, 'users');

    res.status(200).json(newUserForExpense);
});

route.delete('/:userID', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    const expenses: IExpense[] = loadDatabase('expenses');
    const idUser = req.params.userID;

    const user = users.find(user => user.id === idUser);

    if (!user) {
        return res.status(404).json({ message: messages.userNotFound });
    }

    const newUsers = users.filter(user => user.id !== idUser);
    const newExpenses = expenses.filter(expense => expense.userID !== idUser);

    saveDataInJson(newUsers, 'users');
    saveDataInJson(newExpenses, 'expenses');

    res.status(204).json();
});

export default route;
