export interface ICategory {
    id: string;
    name: string;
}
export interface IExpenses {
  id: string;
  name: string;
  categoryID: string;
  userID: string;
  amount: number;
  status: string;
  _category:ICategory;
}

export interface IUsers {
  id: string;
  name: string;
  lastName: string;
  email: string;
  _expenses: IExpenses;
}
