import { InterviewEntity } from "@/entities/interview.entity";

export interface User {
  discordID: string;
  color: string;
  username: string;
  interviews: InterviewEntity[]
}
