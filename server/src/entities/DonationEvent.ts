import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import { User } from "./User"
import { EventType } from "./EventType"
import { DonationEventItem } from "./DonationEventItem"

@Entity()
export class DonationEvent{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    // DonationEvent can only belong to one User | User can have many DonationEvents
    @ManyToOne(() => User, (user) => user.donationEvents)
    createdBy: User

    // DonationEvent can only belong to one EventType | EventType can have many DonationEvents
    @ManyToOne(() => EventType, (eventType) => eventType.donationEvents)
    eventType: EventType;

    // DonationEvent can have many DonationEventItems | DonationEventItem can only belong to one DonationEvent
    @OneToMany(() => DonationEventItem, (donationEventItem) => donationEventItem.donationEvent)
    donationEventItems: DonationEventItem[]

    @Column({
        length: 100,
    })
    name: string

    @Column()
    imageId: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column({
      // By default, upon creation, this donation event is set to True unless stated otherwise
      default: true
    })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}