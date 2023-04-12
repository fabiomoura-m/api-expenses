import express from 'express';
import categoriesRoute from './categories';
import expensesRoute from './expenses';
import usersRoute from './users';

const app = express();

app.use(express.json());

app.use('/categories', categoriesRoute);
app.use('/expenses', expensesRoute);
app.use('/users', usersRoute);

app.listen(3000, () => console.log('server running port 3000'));
