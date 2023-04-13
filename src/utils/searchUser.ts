import { IUser } from "../interfaces/user"
export function searchUser(id: string, users: IUser[]) {
    return users.find(user => user.id === id)
} 