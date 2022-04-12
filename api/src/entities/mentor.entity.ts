import { Mentor } from "@/interfaces/mentor.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { InterviewEntity } from "./interview.entity";

@Entity()
export class MentorEntity extends BaseEntity implements Mentor {
  @PrimaryColumn()
  discordID: string;

  @Column()
  @IsNotEmpty()
  color: string;

  @OneToMany(() => InterviewEntity, (interview) => interview.mentor)
    interviews: InterviewEntity[];
}
