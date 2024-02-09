import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { DonationEventItem } from './DonationEventItem';
import { User } from './User';

export enum Status {
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
}

@Entity()
export class DonationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => DonationEventItem,
    (donationEventItem) => donationEventItem.donationRequests
  )
  donationEventItem: DonationEventItem;

  @Index() // To facilitate for the use case on the occasional lookup of the user's donation requests
  @ManyToOne(() => User, (user) => user.donationRequests)
  user: User;

  @Column({
    nullable: false,
  })
  quantity: number;

  @Column({
    comment: 'If the donor wants to omit the points for this donation request.',
  })
  omitPoints: boolean;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.SUBMITTED,
    comment:
      'The status of the donation request from the donor: submitted, completed',
  })
  status: string;

  @Index() // To facilitate for the use case on the occasional lookup of the drop off date
  @Column({
    nullable: false,
  })
  dropOffDate: Date;

  @Column({
    nullable: false,
  })
  dropOffTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // To support soft deletee
  @DeleteDateColumn()
  deletedAt: Date;
}
