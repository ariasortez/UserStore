import { bcryptAdapter, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import {
  CustomError,
  RegisterUserDOT,
  UserEntity,
  LoginUserDTO,
} from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDOT) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      const { password, ...newUser } = UserEntity.fromObject(user);
      return {
        user: newUser,
      };
    } catch (error) {
      throw CustomError.interalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDTO: LoginUserDTO) {
    const existUser = await UserModel.findOne({ email: loginUserDTO.email });

    try {
      if (!existUser) throw CustomError.badRequest('Email or Password Invalid');
      const validatePassword = bcryptAdapter.compare(
        loginUserDTO.password,
        existUser.password
      );

      if (!validatePassword)
        throw CustomError.badRequest('Email or Password Invalid');

      const { password, ...loggedUser } = UserEntity.fromObject(existUser);

      const token = await JwtAdapter.generateToken({
        id: existUser.id,
        email: existUser.email,
      });

      if (!token) throw CustomError.interalServer('Error generating token');

      return {
        user: loggedUser,
        token,
      };
    } catch (error) {
      throw CustomError.interalServer(`${error}`);
    }
  }
}
