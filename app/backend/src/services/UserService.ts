import * as bcrypt from 'bcryptjs';

import UserModel from '../database/models/User';

import IUser from '../interfaces/IUser';

import UnauthorizedError from '../errors/UnauthorizedError';

export default class UserService {
  public static async findUserByEmail(email: string): Promise<IUser> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    return user as IUser;
  }

  public static async compareUserPassword(password: string, user: IUser): Promise<void> {
    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass) {
      throw new UnauthorizedError('Incorrect email or password');
    }
  }
}
