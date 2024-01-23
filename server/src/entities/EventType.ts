import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Item } from "./Item";
import { DonationEvent } from "./DonationEvent";

@Entity()
export class EventType{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    // EventType can have many Items | Item can only belong to one EventType
    @OneToMany(() => Item, (item) => item.eventType)
    items: Item[];

    // EventType can have many DonationEvents | DonationEvent can only belong to one EventType
    @OneToMany(() => DonationEvent, (donationEvent) => donationEvent.eventType)
    donationEvents: DonationEvent[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}