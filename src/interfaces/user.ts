import { IExpenseForUser } from "./expense";

export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  _expenses: IExpenseForUser[];
}

export interface IBodyUser {
  name: string;
  lastName: string;
  email: string;
}
