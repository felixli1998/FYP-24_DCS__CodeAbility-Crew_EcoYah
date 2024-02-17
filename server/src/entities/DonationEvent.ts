import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm"
import { User } from "./User"
import { EventType } from "./EventType"
import { DonationEventItem } from "./DonationEventItem"
import { DonationRequest } from "./DonationRequest"

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

    @OneToMany(() => DonationRequest, (donationRequest) => donationRequest.donationEvent)
    donationRequests: DonationRequest[]

    @Column({
        length: 100,
        nullable: false
    })
    name: string

    @Column({
      default: null
    })
    imageId: string

    @Column({
      nullable: false
    })
    startDate: Date

    @Column({
      nullable: false
    })
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

    // Validates before inserting the data into the database
    // NOTE: Use try catch to handle the error graciously inside your service / repository
    // TODO: This seems to require a the USER object, not sure if its feasible
    @BeforeInsert()
    beforeInsert(){
      // Line below throws error, requires us to query pass the entire User object
      // when querying the database.
      // if(!this.isValidUser()) throw new Error("Donation Event must be created by a staff or admin")
      if(!this.isValidDateRange()) throw new Error("Start date must be before or equal to end date")
    }

    // Validates before updating the data into the database
    // NOTE: Use try catch to handle the error graciously inside your service / repository
    @BeforeUpdate()
    beforeUpdate() {
      // if(!this.isValidUser()) throw new Error("Donation Event must be created by a staff or admin")
      if(!this.isValidDateRange()) throw new Error("Start date must be before or equal to end date")
    }

    private isValidUser(): boolean{
      return this.createdBy.role === "admin" || this.createdBy.role === "staff"
    }

    private isValidDateRange(): boolean{
      return this.startDate <= this.endDate
    }
}