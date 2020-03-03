import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/index.html')
  getHello() {}

  @Get('/health')
  getHealthCheck(): string {
    return 'OK';
  }
}
