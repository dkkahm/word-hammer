import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const typeOrmOptionsConfig = config.get('typeorm.options') as any;
// console.log(typeOrmOptionsConfig);
export const typeOrmConfig: TypeOrmModuleOptions = {
  ...typeOrmOptionsConfig,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
