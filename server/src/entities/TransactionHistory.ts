import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
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

  @Column()
  userPointsId: number; // A workaround to reduce the new of associating the entire object but ID only

  @OneToOne(
    () => DonationRequest,
    (donationRequest) => donationRequest.transactionHistory,
    { nullable: true }
  )
  @JoinColumn()
  donationRequest: DonationRequest;

  @Column()
  donationRequestId: number;  // A workaround to reduce the new of associating the entire object but ID only

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