import { Interview, InterviewStatus } from "@/interfaces/interview.interface";
import { Mentor } from "@/interfaces/mentor.interface";
import { Student } from "@/interfaces/student.interface";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MentorEntity } from "./mentor.entity";
import { StudentEntity } from "./student.entity";

@Entity()
export class InterviewEntity extends BaseEntity implements Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentEntity, (user) => user.interviews)
    student: Student

  @ManyToOne(() => MentorEntity, (user) => user.interviews)
    mentor: Mentor

  @Column('timetz')
  @IsNotEmpty()
  startDate: string;

  @Column('timetz')
  @IsNotEmpty()
  endDate: string;

  @Column({
    type: "enum",
    enum: InterviewStatus,
    default: InterviewStatus.pending
  })
  status: InterviewStatus

}
