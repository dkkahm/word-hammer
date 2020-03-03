import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredential } from './dto/user-credential.dto';
import { SignupRsp } from './dto/signup-rsp.dto';
import { SigninRsp } from './dto/signin-rsp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userCredential: UserCredential): Promise<SignupRsp> {
    const user = await this.authService.signUp(userCredential);

    return {
      username: user.username,
      role: user.role,
    };
  }

  @Post('/signin')
  async signIn(@Body() userCredential: UserCredential): Promise<SigninRsp> {
    return await this.authService.signIn(userCredential);
  }
}
