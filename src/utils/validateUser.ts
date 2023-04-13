export function validateUser(user: any) {
    const requiredFields = ["id", "name", "lastName", "email", "_expenses"];
  
    for (const field of requiredFields) {
      if (!user[field]) {
        return true;
      }
    }
    return false;
  }