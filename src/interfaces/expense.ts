export interface IExpense {
    id: string;
    name: string;
    categoryID: string;
    userID: string;
    amount: number;
    status: string;
    _user: { [key: string]: unknown };
    _category: { [key: string]: unknown };
}
