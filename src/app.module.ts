import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm-options';
import { DocModule } from './doc/doc.module';
import { SessionModule } from './session/session.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './common/middlewares/logger.middlewares';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    DocModule,
    SessionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'build'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {
  // configure(consumter: MiddlewareConsumer) {
  //   consumter.apply(LoggerMiddleware).forRoutes('/');
  // }
}
