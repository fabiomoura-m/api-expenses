import express from 'express';
import { Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';
import { IExpense } from './interfaces/expense';

const route = express.Router();

route.get('/', (req: Request, res: Response) => {
    const expenses = loadDatabase('expenses');

    res.status(200).json(expenses);
});

route.get('/:id', (req: Request, res: Response) => {
    const expenses = loadDatabase('expenses');
    const id = req.params.id;

    const expense: IExpense = expenses.find((item: IExpense) => item.id === id);

    if(!expense){
        res.status(404).json({message: 'Despesa não encontrada'})
    }

    res.status(200).json(expense);
});

export default route;
