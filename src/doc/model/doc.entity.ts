import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['questionHash'])
export class Doc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  description: string;

  @Column()
  answer: string;

  @Column()
  answerLength: number;

  @Column()
  questionHash: string;
}
