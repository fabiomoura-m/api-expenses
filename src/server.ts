import express from 'express';
import { Router, Request, Response } from 'express';
import loadDatabase from './utils/loadDatabase';

const app = express();
const route = Router();

app.use(express.json());

route.get('/categories', (req: Request, res: Response) => {
    const categorias = loadDatabase('categories');

    res.json(categorias);
});
route.get('/expenses', (req: Request, res: Response) => {
    const expenses = loadDatabase('expenses');

    res.json(expenses);
});
route.get('/users', (req: Request, res: Response) => {
    const users = loadDatabase('users');

    res.json(users);
});

app.use(route);

app.listen(3000, () => 'server running port 3000');
