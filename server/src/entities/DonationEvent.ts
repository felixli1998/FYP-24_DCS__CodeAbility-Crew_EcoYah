import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import { EventType } from "./EventType"

@Entity()
export class DonationEvent{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User) @JoinColumn()
    user: User

    @OneToOne(() => EventType) @JoinColumn()
    eventType: EventType

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

    @Column()
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}