import express, { request, response } from "express";
import { Request, Response } from "express";
import loadDatabase from "./utils/loadDatabase";
import { verificationUsers } from "./utils/verificationUsers";
const route = express.Router();

route.get("/", (req: Request, res: Response) => {
  if (verificationUsers) {
    const users = loadDatabase("users");

    return res.status(200).json(users);
  }

  return res.status(500);
});


export default route;
