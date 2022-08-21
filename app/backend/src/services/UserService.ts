import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';

import UserModel from '../database/models/User';

import IUser from '../interfaces/IUser';

import UnauthorizedError from '../errors/UnauthorizedError';

export default class UserService {
  public static async findUserByEmail(email: string) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    return user;
  }

  public static async compareUserPassword(password: string, user: IUser) {
    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass) {
      throw new UnauthorizedError('Incorrect email or password');
    }
  }

  public static async getUserRole(data: string | JwtPayload) {
    const user = Object.entries(data)[0][1];

    return user.role;
  }
}
