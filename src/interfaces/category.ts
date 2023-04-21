import { IExpenseForUser } from './expense';

export interface ICategory {
    id: string;
    name: string;
}
export interface IBodyCategory {
    name: string;
}

export interface ICategoryWithExpenses extends ICategory {
    _expenses: IExpenseForUser[];
}
