import { UserModel } from '../../data';
import { CustomError, RegisterUserDOT } from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDOT) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    return 'Todo ok';
  }
}
