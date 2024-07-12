import { Request, Response } from 'express';
import { RegisterUserDOT } from '../../domain/';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  register = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDOT.crate(req.body);

    if (error) return res.status(400).json({ error });

    this.authService.registerUser(registerDto!).then((user) => res.json(user));
  };

  loginUser = (req: Request, res: Response) => {
    res.json('userLogged');
  };

  validateEmail = (req: Request, res: Response) => {
    res.json('emailValidated');
  };
}
