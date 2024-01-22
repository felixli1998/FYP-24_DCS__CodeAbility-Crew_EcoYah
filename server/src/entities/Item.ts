import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { EventType } from "./EventType"

@Entity()
export class Item{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    unit: string

    @OneToOne(() => EventType) @JoinColumn()
    eventType: EventType

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}