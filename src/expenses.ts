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
import {
    bodyExpectedPutSchema,
    bodyPostSchema,
    bodyUpdateSchema
} from './schemas/expenses';
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

    const { error } = bodyPostSchema.validate(body);

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

        users[indexUser]._expenses.push(newExpenseForUser);
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

route.put('/:expenseID', (req: Request, res: Response) => {
    const expenses: IExpense[] = loadDatabase('expenses');
    const categories: ICategory[] = loadDatabase('categories');
    const users: IUser[] = loadDatabase('users');
    const body: Partial<IExpense> = req.body;
    const idExpense = req.params.expenseID;

    let expenseIndex = expenses.findIndex(expense => expense.id === idExpense);

    if (expenseIndex === -1) {
        return res.status(404).json({ message: messages.expenseNotFound });
    }

    const { error } = bodyUpdateSchema.validate(body);
    if (error) {
        return res.status(400).json({
            message: messages.expenseNotUpdated,
            BodyExpected: bodyExpectedPutSchema
        });
    }

    const { categoryID, userID } = body;

    const currentCategory = categories.find(
        category => category.id === categoryID
    );
    if (!currentCategory) {
        return res.status(404).json({ message: messages.categoryIDNotFound });
    }

    const currentUser = users.find(user => user.id === userID);
    if (!currentUser) {
        return res.status(404).json({ message: messages.userIDNotFound });
    }

    const currentExpense = expenses[expenseIndex];
    const idUserExpense = currentExpense.userID;

    // Se o usuario da despesa foi alterado
    if (userID !== idUserExpense) {
        const oldUser = users.find(user => user.id === idUserExpense);
        // remove do usuario antigo a despesa
        if (oldUser) {
            oldUser._expenses = oldUser._expenses.filter(
                expense => expense.id !== idExpense
            );
        }

        // adiciona ao novo usuário a despesa
        const newExpenseForUser: IExpenseForUser = {
            id: idExpense,
            name: body.name ?? currentExpense.name,
            categoryID: body.categoryID ?? currentExpense.categoryID,
            userID: body.userID ?? currentExpense.userID,
            amount: body.amount ?? currentExpense.amount,
            status: body.status ?? currentExpense.status,
            _category: {
                ...currentCategory
            }
        };

        currentUser._expenses.push(newExpenseForUser);
    } else {
        // atualiza os dados da despesa no usuário
        const expense = currentUser._expenses.find(
            expense => expense.id === idExpense
        );
        if (expense) {
            expense.name = body.name ?? currentExpense.name;
            expense.categoryID = body.categoryID ?? currentExpense.categoryID;
            expense.amount = body.amount ?? currentExpense.amount;
            expense.status = body.status ?? currentExpense.status;
            expense._category = {
                ...currentCategory
            };
        }
    }

    const { id, name, lastName, email } = currentUser;
    const updatedExpense: IExpense = {
        id: idExpense,
        name: body.name ?? currentExpense.name,
        categoryID: body.categoryID ?? currentExpense.categoryID,
        userID: body.userID ?? currentExpense.userID,
        amount: body.amount ?? currentExpense.amount,
        status: body.status ?? currentExpense.status,
        _user: {
            id,
            name,
            lastName,
            email
        },
        _category: {
            ...currentCategory
        }
    };

    expenses[expenseIndex] = updatedExpense;
    saveDataInJson(expenses, 'expenses');
    saveDataInJson(users, 'users');

    return res.status(200).json(updatedExpense);
});

export default route;
