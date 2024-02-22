import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserPoints {
  // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
  // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0, // Every new user will start with 0 points
    comment: 'The user points',
  })
  points: number;

  @OneToOne(() => User, (user) => user.userPoints)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
