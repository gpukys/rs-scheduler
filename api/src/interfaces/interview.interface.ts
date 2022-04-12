import { Mentor } from "./mentor.interface";
import { Student } from "./student.interface";

export interface Interview {
  id: number;
  student: Student;
  mentor?: Mentor;
  startDate: string;
  endDate: string;
  status: InterviewStatus;
}

export enum InterviewStatus {
  pending = 'PENDING',
  completed = 'COMPLETED',
  cancelled = 'CANCELLED'
}
