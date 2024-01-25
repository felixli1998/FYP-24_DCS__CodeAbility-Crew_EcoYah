import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { EventType } from "./EventType"
import { DonationEventItem } from "./DonationEventItem"

@Entity()
export class Item{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        nullable: false
    })
    name: string

    @Column({
      nullable: false
    })
    unit: string

    // Item can have many DonationEventItems | DonationEventItem can only belong to one Item
    @OneToMany(() => DonationEventItem, (donationEventItem) => donationEventItem.item)
    donationEventItems: DonationEventItem[];

    // Item can only belong to one EventType | EventType can have many Items
    @ManyToOne(() => EventType, (eventType) => eventType.items)
    eventType: EventType;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}