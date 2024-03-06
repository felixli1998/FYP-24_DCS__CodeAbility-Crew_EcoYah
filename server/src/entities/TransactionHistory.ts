import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { DonationRequest } from "./DonationRequest";
import { UserPoints } from "./UserPoints";

export enum Action {
  EXPIRED = "expired",
  CREDITED = "credited",
  REDEEMED = "redeemed"
}

@Entity()
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  // Transaction History can only belong to one User Point | User Point can have many Transaction History
  @ManyToOne(() => UserPoints, (userPoints) => userPoints.transactionHistory)
  userPoints: UserPoints;

  // TODO: Is this really essential to let them track how they earn this points. Perhaps can be useful in the FE history
  @OneToMany(
    () => DonationRequest,
    (donationRequest) => donationRequest.donationEvent,
    { nullable: true }
  )
  donationRequests?: DonationRequest[];

  @Column({
    comment: "The mutated point value"
  })
  points: number;

  @Column({
    comment: "The reason for the points mutation: Expired, Credited, Redeemed",
    nullable: false,
    enum: Action
  })
  action: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}