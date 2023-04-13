export function searchUser(id:string){
    const users = require('../../database/users.json')
    let contador:number = 0
    while(users[contador].id !== id){
        contador++
    }
    return users[contador]  
}