import { Request, Response } from 'express';

import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';
import JwtService from '../services/JwtService';

export default class LoginController {
  public static async login(req: Request, res:Response) {
    await ValidationService.validateReqBody(req.body);

    const { email, password } = req.body;
    const user = await UserService.findUserByEmail(email);
    await UserService.compareUserPassword(password, user);

    const token = await JwtService.createToken(user);

    return res.status(200).json({ token });
  }

  public static async getUserRole(req: Request, res: Response) {
    const token = req.headers.authorization;
    const role = await JwtService.validateToken(token as string);

    res.status(200).json({ role });
  }
}
