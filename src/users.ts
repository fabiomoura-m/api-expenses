import express, { request, response } from "express";
import { Request, Response } from "express";
import loadDatabase from "./utils/loadDatabase";
import { searchUser } from "./utils/searchUser";
import { IUser } from "./interfaces/user";

const route = express.Router();
const users: IUser[] = loadDatabase("users");

route.get("/", (req: Request, res: Response) => {
  return res.status(200).json(users);
});

route.get("/:id", (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result = searchUser(id, users);
  if(result == undefined){
    return res.status(400).json('Usúario não encontrado')
  }
  return res.status(200).json(result);
});

export default route;

