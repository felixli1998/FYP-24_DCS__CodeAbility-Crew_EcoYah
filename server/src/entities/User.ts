import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm"

export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  DONOR = "donor",
}

export enum Status {
  ACTIVE = "active",
  TERMINATED = "terminated",
}

@Entity()
export class User{
    // Stick to using TypeORM style using PrimaryGeneratedColumn() to generate the primary key
    // This will help to facilitate in create OneToMany and ManyToOne relationships, join tables, etc.
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        unique: true // This will ensure that the email is unique
    })
    email: string

    @Column()
    password_digest: string

    @Column()
    name: string

    @Column()
    contact_num: string

    // TODO: This will subsequently be used to store the s3 image in the server
    @Column({
      default: null
    })
    image_id: string

    // By default, the role will always be donor. Only the developers has the autonomy to create profiles of different role //
    @Column({
      type: "enum",
      enum: UserRole,
      default: UserRole.DONOR,
      comment: "Consist of the user roles: admin, staff, donor"
    })
    role: string

    // By default, the status will be set as active upon an account creation //
    @Column({
      type: "enum",
      enum: Status,
      default: Status.ACTIVE,
      comment: "Consist of the user status: active, terminated"
    })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}