import { dataSource } from "@/databases";
import { InterviewEntity } from "@/entities/interview.entity";
import { Role } from "@/models";
import { NextFunction, Request, Response } from "express-serve-static-core";

class InterviewController {
  
  async getAllInterviews(req: Request, res: Response, next: NextFunction) {
    const interviewRepository = dataSource.getRepository(InterviewEntity);
    const roles = req.session.user.roles;
    let interviews: InterviewEntity[];
    if (!roles.includes(Role.MENTOR)) {
      interviews = await interviewRepository.find({relations: ['student', 'mentor']});
    } else {
      interviews = await interviewRepository.find({where: {mentor: {discordID: req.session.user.discordID}}, relations: ['student', 'mentor']});
    }
    res.json(interviews)
  }

  async createInterview(req: Request, res: Response, next: NextFunction) {
    const request = req.body;
    const interview = new InterviewEntity();
    interview.student = request.studentId;
    interview.mentor = request.mentorId || null;
    interview.startDate = request.startDate;
    interview.endDate = request.endDate;
    await interview.save();
    
    res.sendStatus(201);
  }

}

export default InterviewController;
