import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn , UpdateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class DrawWinner {

  @PrimaryGeneratedColumn("uuid")
  id!:string

  @Column()
  Cycle!: string;

  @Column({
    type: "datetime",
    nullable: true,
  })
  won_At!: Date | null;

  @ManyToOne("LuckyDraw", "winners", {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "draw_id",
  })
  draw!: any;

  @ManyToOne("DrawParticipant", "wins", {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "participant",
  })
  participant!: any;

  @CreateDateColumn({
  type: "datetime",
})
createdAt!: Date;

@UpdateDateColumn({
  type: "datetime",
})
updatedAt!: Date;
}