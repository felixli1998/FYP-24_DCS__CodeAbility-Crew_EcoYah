import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { Item } from "./Item"
import { DonationEvent } from "./DonationEvent"

@Entity()
export class DonationEventItem{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    // DonationEventItem can only belong to one Item | Item can have many DonationEventItems
    @ManyToOne(() => Item, (item) => item.donationEventItems)
    item: Item

    // DonationEventItem can only belong to one DonationEvent | DonationEvent can have many DonationEventItems
    @ManyToOne(() => DonationEvent, (donationEvent) => donationEvent.donationEventItems)
    donationEvent: DonationEvent

    @Column({
      nullable: false
    })
    targetQty: number

    @Column({
      default: 0
    })
    currentQty: number

    @Column({
      nullable: false
    })
    minQty: number

    @Column({
      nullable: false
    })
    pointsPerUnit: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}