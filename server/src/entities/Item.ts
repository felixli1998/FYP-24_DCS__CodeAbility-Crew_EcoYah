import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Item{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100
    })
    name: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}