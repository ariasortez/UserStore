import { regularExps } from '../../../config';

export class RegisterUserDOT {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static crate(object: { [key: string]: any }): [string?, RegisterUserDOT?] {
    const { name, email, password } = object;

    if (!name) return ['Missing name'];
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];

    return [undefined, new RegisterUserDOT(name, email, password)];
  }
}
