import { Request } from "express";
import { IUser } from "./userTypes";

export interface IAuthRequest extends Request {
  user: IUser;
}
