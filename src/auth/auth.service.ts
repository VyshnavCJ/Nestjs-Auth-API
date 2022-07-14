import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, SiginDto } from './dto';
import * as argon from 'argon2';
import { User } from './db';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SiginDto) {
    //find user by email
    const user = await this.userRepository.findOne({
      where: {
        emailAddress: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    //password match
    const pwdMatch = await argon.verify(user.password, dto.password);
    if (!pwdMatch) throw new ForbiddenException('Credentials incorrect');
    const token = await this.signToken(user.username, user.emailAddress);
    return token;
  }

  async signup(dto: AuthDto) {
    //generate hash password
    const hash = await argon.hash(dto.password);

    //save user to db
    try {
      const newUser = this.userRepository.create({
        username: dto.name,
        emailAddress: dto.email,
        password: hash,
        phoneNo: dto.phone,
      });
      const result = this.userRepository.save(newUser).catch((err) => {
        if (err.code === 'ER_DUP_ENTRY') {
          return {
            msg: 'Email or Phone Number is used by another User plz Try again!',
          };
        }
      });
      return result;
    } catch (error) {
      return { error: error };
    }
  }

  //Generating JWT Tokens
  async signToken(
    name: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: name,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { access_token: token };
  }
}
