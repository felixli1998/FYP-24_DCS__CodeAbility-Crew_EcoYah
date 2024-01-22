import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm"
import { Item } from "./Item"
import { DonationEvent } from "./DonationEvent"

@Entity()
export class DonationEventItem{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Item) @JoinColumn()
    item: Item

    @OneToOne(() => DonationEvent) @JoinColumn()
    DonationEvent: DonationEvent

    @Column()
    targetQty: number

    @Column()
    currentQty: number

    @Column()
    minQty: number

    @Column()
    pointsPerUnit: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}