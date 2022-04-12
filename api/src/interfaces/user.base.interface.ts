import { InterviewEntity } from "@/entities/interview.entity";

export interface User {
  discordID: string;
  color: string;
  interviews: InterviewEntity[]
}
