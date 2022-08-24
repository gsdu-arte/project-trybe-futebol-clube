import * as jwt from 'jsonwebtoken';

import IUser from '../interfaces/IUser';

import UnauthorizedError from '../errors/UnauthorizedError';

const secret: string = process.env.JWT_SECRET || 'jwt_secret';

export default class JwtService {
  public static async createToken(payload: IUser): Promise<string> {
    const token = jwt.sign({ payload }, secret);

    return token;
  }

  public static async validateToken(token: string): Promise<string> {
    try {
      const data = jwt.verify(token, secret);
      const user = Object.entries(data)[0][1];

      return user.role;
    } catch (error) {
      throw new UnauthorizedError('Token must be a valid token');
    }
  }
}
