import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { User } from "./User";
import { TransactionHistory } from "./TransactionHistory";

@Entity()
export class UserPoints {
  // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
  // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0, // Every new user will start with 0 points
    comment: "The user points",
  })
  points: number;

  @OneToMany(() => TransactionHistory, (transactionHistory) => transactionHistory.userPoints)
  transactionHistory: TransactionHistory[];

  @OneToOne(() => User, (user) => user.userPoints, { cascade: ["insert"] })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
