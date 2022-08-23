import * as jwt from 'jsonwebtoken';

import IUser from '../interfaces/IUser';

import BadRequestError from '../errors/BadRequestError';

const secret: string = process.env.JWT_SECRET || 'jwt_secret';

export default class JwtService {
  public static async createToken(payload: IUser): Promise<string> {
    const token = jwt.sign({ payload }, secret);

    return token;
  }

  public static async validateToken(token: string | undefined): Promise<string> {
    if (!token) throw new BadRequestError('Token not found');
    const data = jwt.verify(token, secret);
    const user: IUser = Object.entries(data)[0][1];

    return user.role;
  }
}
