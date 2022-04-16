import { Student } from "@/interfaces/student.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { InterviewEntity } from "./interview.entity";

@Entity()
export class StudentEntity extends BaseEntity implements Student {
  @PrimaryColumn()
  discordID: string;

  @Column()
  @IsNotEmpty()
  color: string;

  @Column()
  username: string;

  @OneToMany(() => InterviewEntity, (interview) => interview.student, { cascade: true, onDelete: "CASCADE" })
    interviews: InterviewEntity[];
}
