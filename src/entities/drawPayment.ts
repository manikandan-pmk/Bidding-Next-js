import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";

@Entity()
export class DrawPayments {
  @PrimaryGeneratedColumn("uuid")
  payment_Cycle!: string;

  @Column()
  amount!: number;

  @Column()
  payment_Photo!: string;

  @Column({
    default: false,
  })
  isVerified!: boolean;

  @Column({
    type: "datetime",
    nullable: true,
  })
  verified_At!: Date | null;

  @ManyToOne(
    "DrawParticipant",
    "payments",
    {
      onDelete: "CASCADE",
    }
  )
  participants!: any;

  @CreateDateColumn({
  type: "datetime",
})
createdAt!: Date;

@UpdateDateColumn({
  type: "datetime",
})
updatedAt!: Date;
}