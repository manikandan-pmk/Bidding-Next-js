import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,CreateDateColumn , UpdateDateColumn
} from "typeorm";

export enum DurationUnit {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

@Entity()
export class LuckyDraw {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  no_of_peoples!: number;

  @Column()
  amount!: number;

  @Column()
  duration_Value!: number;

  @Column({
    type: "enum",
    enum: DurationUnit,
  })
  duration_Unit!: DurationUnit;

  @Column()
  upi_Id!: string;

  @Column()
  qr_Code!: string;

  @ManyToOne("User", "luckyDraws", {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
  })
  user!: any;

  @OneToMany("DrawParticipant", "draw")
  participants!: any[];

  @OneToMany("DrawWinner", "draw")
  winners!: any[];

  @CreateDateColumn({
    type: "datetime",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "datetime",
  })
  updatedAt!: Date;
}
