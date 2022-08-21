import ILogin from '../interfaces/ILogin';

import BadRequestError from '../errors/BadRequestError';

export default class ValidationService {
  public static async validateReqBody(data: ILogin) {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestError('All fields must be filled');
    }
  }
}
