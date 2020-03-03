import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Repository } from 'typeorm';
import { UserCredential } from './dto/user-credential.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './model/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userCredential: UserCredential) {
    try {
      const user = await this.userRepository.save({
        username: userCredential.username,
        password: await bcrypt.hash(userCredential.password, 10),
        role: UserRole.STUDENT,
      });

      return user;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('username exists');
      } else {
        throw error;
      }
    }
  }

  async signIn(userCredential: UserCredential): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      username: userCredential.username,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(userCredential.password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
