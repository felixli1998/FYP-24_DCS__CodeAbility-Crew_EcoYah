import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { DonationRequestItem } from "./DonationRequestItem";
import { DonationEvent } from "./DonationEvent";
import { TransactionHistory } from "./TransactionHistory";

export enum Status {
  SUBMITTED = "submitted",
  COMPLETED = "completed",
  WITHDRAWN = "withdrawn",
}

@Entity()
export class DonationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Index() // To facilitate for the use case on the occasional lookup of the user's donation requests
  @ManyToOne(() => User, (user) => user.donationRequests, { nullable: false })
  user: User;

  @OneToMany(
    () => DonationRequestItem,
    (DonationRequestItem) => DonationRequestItem.donationRequest,
    { cascade: ["update", "insert"], nullable: false },
  )
  donationRequestItems: DonationRequestItem[];

  @ManyToOne(
    () => DonationEvent,
    (donationEvent) => donationEvent.donationRequests,
    { nullable: false },
  )
  donationEvent: DonationEvent;

  @OneToOne(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.donationRequest
  )
  transactionHistory: TransactionHistory;

  @Column({
    comment: "If the donor wants to omit the points for this donation request.",
  })
  omitPoints: boolean;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.SUBMITTED,
    comment:
      "The status of the donation request from the donor: submitted, completed",
  })
  status: string;

  @Index() // To facilitate for the use case on the occasional lookup of the drop off date
  @Column({
    nullable: false,
    comment: "The date when the donor wants to drop off the donation items.",
  })
  dropOffDate: Date;

  @Column({
    nullable: false,
    comment: "The time when the donor wants to drop off the donation items.",
  })
  dropOffTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // To support soft delete
  @DeleteDateColumn({
    comment:
      "The date at which the donor wish to terminate the donation request.",
  })
  deletedAt: Date;
}
