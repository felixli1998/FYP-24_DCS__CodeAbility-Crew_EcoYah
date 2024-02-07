import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { DonationRequest } from './DonationRequest';
import { DonationEventItem } from './DonationEventItem';
// import { DonationEventItem } from './DonationEventItem';
// import { User } from './User';

export enum Status {
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
}

@Entity()
export class DonationRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  quantity: number;

  // Belongs to a donation request
  @ManyToOne(() => DonationRequest, (donationRequest) => donationRequest.donationRequestItems)
  donationRequest: DonationRequest;

  // Belongs to a donation event item
  @ManyToOne(() => DonationEventItem, (donationEventItem) => donationEventItem.donationRequestItems)
  donationEventItem: DonationEventItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
