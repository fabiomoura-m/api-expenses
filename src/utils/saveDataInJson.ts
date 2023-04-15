import fs from 'fs';
import { ICategory } from '../interfaces/category';
import { IExpense } from '../interfaces/expense';
import { IUser } from '../interfaces/user';

function saveDataInJson(
    data: (ICategory | IExpense | IUser)[],
    database: string
) {
    const dataproductsPath = `./database/${database}.json`;
    const productsString = JSON.stringify(data);
    return fs.writeFileSync(dataproductsPath, productsString);
}

export default saveDataInJson;
