import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
