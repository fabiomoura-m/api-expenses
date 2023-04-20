import express, { request, response } from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { searchUser } from './utils/searchUser';
import { IUser } from './interfaces/user';
import { bodyPostSchema } from './schemas/users';
import messages from './enums/messages';
import generateRandomNumber from './utils/generateRandomId';
import saveDataInJson from './utils/saveDataInJson';
import { IExpense } from './interfaces/expense';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    return res.status(200).json(users);
});

route.get('/:id', (req: Request, res: Response) => {
    const users: IUser[] = loadDatabase('users');
    const id: string = req.params.id;
    const result = searchUser(id, users);
    if (result == undefined) {
        return res.status(404).json({ message: messages.userNotFound });
    }
    return res.status(200).json(result);
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

    const { error } = bodyPostSchema.validate(data);

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
