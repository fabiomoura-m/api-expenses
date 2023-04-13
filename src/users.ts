import express, { request, response } from "express";
import { Request, Response } from "express";
import loadDatabase from "./utils/loadDatabase";
import { searchUser } from "./utils/searchUser";
import { IUser } from "./interfaces/user";
import { addUser } from "./utils/addUser";
import { validateUser } from "./utils/validateUser";
const route = express.Router();
const users: IUser[] = loadDatabase("users");

route.get("/", (req: Request, res: Response) => {
  return res.status(200).json(users);
});

route.get("/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result = searchUser(id, users);
  if (result == undefined) {
    return res.status(404).json({ message: "Usuário não encotrado" });
  }
  return res.status(200).json(result);
});

route.post("/addUser", (req: Request, res: Response) => {
  const newUser: IUser = req.body;
  if (validateUser(newUser)) {
    return res.status(400).json({ message: `Usúario incompleto ` });
  }
  addUser(newUser, users);
  return res.status(200).json({ message: `Cliente adicionado com sucesso ` });
});

export default route;
