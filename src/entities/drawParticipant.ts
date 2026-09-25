import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";


export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHERS = "OTHERS",
}

@Entity()
export class DrawParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column()
  email!: string;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender!: Gender;

  @Column()
  phone_Number!: string;

  @Column()
  photo!: string;

  @Column()
  id_Proof!: string;

  @Column({
    default: false,
  })
  is_Verified!: boolean;

  @Column({
    default: false,
  })
  is_Winned_Participant!: boolean;

  @Column({
    type: "datetime",
    nullable: true,
  })
  is_Winned_Time!: Date | null;

  @ManyToOne("LuckyDraw", "participants", {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "draw_id",
  })
  draw!: any;

  @OneToMany("DrawPayments", "participants", {
    cascade: true,
  })
  payments!: any[];

  @OneToMany("DrawWinner","participants")
  wins!: any[];

  @CreateDateColumn({
  type: "datetime",
})
createdAt!: Date;

@UpdateDateColumn({
  type: "datetime",
})
updatedAt!: Date;
}
