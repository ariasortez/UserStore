import { UserModel } from '../../data';
import { CustomError, RegisterUserDOT, UserEntity } from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDOT) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      const { password, ...newUser } = UserEntity.fromObject(user);
      return {
        user: newUser,
      };
    } catch (error) {}

    return 'Todo ok';
  }
}
