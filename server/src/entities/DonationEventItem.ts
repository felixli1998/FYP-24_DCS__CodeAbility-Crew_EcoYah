import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm"
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

     // Validates before inserting the data into the database
    // NOTE: Use try catch to handle the error graciously inside your service / repository
    @BeforeInsert()
    beforeInsert(){
      if(!this.isValidTargetQty()) throw new Error("Target Qty has to be more than 0")

    }

    private isValidTargetQty(){
      return this.targetQty > 0
    }
}