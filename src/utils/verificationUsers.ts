import fs from "fs";


function existenceCheck() {
  if (fs.existsSync('./database/users.json')) {
    return true;
  }
  return false;
}
function usersExist(){
  const data = require('../../database/users.json')

  if(data[1].email){
    return true
  }
  
  return false
}

export const verificationUsers = existenceCheck() && usersExist() ? true : false;