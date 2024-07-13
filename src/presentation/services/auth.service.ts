import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import {
  CustomError,
  RegisterUserDOT,
  UserEntity,
  LoginUserDTO,
} from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDOT) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      await this.sendEmailValidationLink(user.email);

      const { password, ...newUser } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });
      return {
        user: newUser,
        token,
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

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.interalServer('Error generating token');
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your account</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.interalServer('Error sending emai');
  };
}
