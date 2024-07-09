import { Request, Response } from 'express';

export class AuthController {
  constructor() {}

  register = (req: Request, res: Response) => {
    res.json('registerUSer');
  };

  loginUser = (req: Request, res: Response) => {
    res.json('userLogged');
  };

  validateEmail = (req: Request, res: Response) => {
    res.json('emailValidated');
  };
}
