import express, { request, response } from "express";
import { Request, Response } from "express";
import loadDatabase from "./utils/loadDatabase";
import { searchUser } from "./utils/searchUser";
// import { verificationUsers } from "./utils/verificationUsers";
const route = express.Router();

route.get("/", (req: Request, res: Response) => {
    const users = loadDatabase("users");
    return res.status(200).json(users);
});

route.get("/:id", (req: Request, res: Response) => {
  const users = loadDatabase("users");
  const id = (req.params.id);
  const result = searchUser(id)
  return res.status(200).json(result)
});
export default route;
