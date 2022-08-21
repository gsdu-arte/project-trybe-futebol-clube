import * as jwt from 'jsonwebtoken';

import IUser from '../interfaces/IUser';

const secret = process.env.JWT_SECRET || 'jwt_secret';

export default class JwtService {
  static async createToken(payload: IUser): Promise<string> {
    const token = jwt.sign({ payload }, secret);

    return token;
  }

  static async validateToken(token: string | undefined) {
    if (!token) throw new Error('Token not found');
    const data = jwt.verify(token, secret);

    return data;
  }
}
