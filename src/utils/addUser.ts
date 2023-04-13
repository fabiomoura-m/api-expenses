import { IUser } from "../interfaces/user";
import fs from 'fs';

export function addUser(newUser:IUser, users:IUser[]){
    users.push(newUser);
    const jsonCustomers = JSON.stringify(users);
    fs.writeFileSync("./database/users.json", jsonCustomers);
}