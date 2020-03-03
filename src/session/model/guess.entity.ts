import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['userId', 'docId'])
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  docId: number;

  @Column()
  exposeCount: number;

  @Column()
  hitCount: number;
}
