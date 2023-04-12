import { ICategory } from './category';

export interface IExpense {
    id: string;
    name: string;
    categoryID: string;
    userID: string;
    amount: number;
    status: string;
    _user: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };
    _category: ICategory;
}
