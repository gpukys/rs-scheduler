import { dataSource } from "@/databases";
import { InterviewEntity } from "@/entities/interview.entity";
import { HttpException } from "@/exceptions/HttpException";
import { InterviewStatus } from "@/interfaces/interview.interface";
import { isMentor } from "@/utils/isMentor";
import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { Not } from "typeorm";
import { compareAsc } from 'date-fns'

class InterviewController {
  
  async getAllInterviews(req: Request, res: Response, next: NextFunction) {
    try {
      const interviewRepository = dataSource.getRepository(InterviewEntity);
      let interviews: InterviewEntity[];
      if (isMentor(req.session)) {
        interviews = await interviewRepository.find({where: {status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
      } else {
        interviews = await interviewRepository.find({where: {student: {discordID: req.session.user.discordID}, status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
      }
      res.json(interviews)
    } catch (err) {
      next(err);
    }
  }

  async getInterviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const interviewRepository = dataSource.getRepository(InterviewEntity);
      let interview: InterviewEntity;
      if (isMentor(req.session)) {
        interview = await interviewRepository.findOne({where: {id: Number(req.params.id)}, relations: ['student', 'mentor']});
      } else {
        interview = await interviewRepository.findOne({where: {student: {discordID: req.session.user.discordID}, id: Number(req.params.id)}, relations: ['student', 'mentor']});
      }
      if (!interview) {
        next(new HttpException(404, 'Interview not found'));
        return;
      }
      res.json(interview)
    } catch (err) {
      next(err);
    }
  }

  async createInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body;
      const interview = new InterviewEntity();
      interview.student = request.student;
      interview.mentor = request.mentor || null;
      interview.startDate = request.startDate;
      interview.endDate = request.endDate;
      const saved = await interview.save();
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }

  async patchInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body;
      const interviewRepo = dataSource.getRepository(InterviewEntity);
      const interviewToPatch = await interviewRepo.findOne({where: {id: Number(req.params.interviewId)}, relations: ['student']});
      if (!interviewToPatch) {
        next(new HttpException(404, 'Interview not found'))
        return;
      }
      if (!isMentor(req.session) && interviewToPatch.student.discordID !== req.session.user.discordID) {
        logger.log('info', JSON.stringify(interviewToPatch))
        logger.log('info', req.session.user.discordID)
        next(new HttpException(403, 'You can only modify your own interviews'))
        return;
      }
      for (const key in request) {
        interviewToPatch[key] = request[key]
      }
      
      const result = await interviewToPatch.save();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const interviewRepo = dataSource.getRepository(InterviewEntity);
      const interviewToDelete = await interviewRepo.findOne({where: {id: Number(req.params.interviewId)}, relations: ['student', 'mentor']});
      if (!interviewToDelete) {
        next(new HttpException(404, 'Interview not found'))
        return;
      }
      if (!isMentor(req.session) && interviewToDelete.student.discordID !== req.session.user.discordID) {
        next(new HttpException(403, 'You can only modify your own interviews'))
        return;
      }

      if (interviewToDelete.mentor) {
        next(new HttpException(400, 'You can not delete a confirmed interview'))
        return;
      }
      
      await interviewToDelete.remove();
      res.json({});
    } catch (err) {
      next(err);
    }
  }

  async getCurrentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const interviewRepo = dataSource.getRepository(InterviewEntity);
      let interviews: InterviewEntity[];
      if (isMentor(req.session)) {
        interviews = await interviewRepo.find({where: {status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
      } else {
        interviews = await interviewRepo.find({where: {student: {discordID: req.session.user.discordID}, status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
      }
      const confirmedInterviews = interviews.filter(interview => interview.student && interview.mentor).sort((a, b) => compareAsc(new Date(a.startDate), new Date(b.startDate)))
      const result = {
        hasScheduled: interviews.length > 0,
        closestInterview: confirmedInterviews.length ? confirmedInterviews[0] : null
      }
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  async confirmInterview(req: Request, res: Response, next: NextFunction) {
    const interviewRepo = dataSource.getRepository(InterviewEntity);
    if (!isMentor(req.session)) {
      next(new HttpException(403, 'Only mentors can confirm interviews'))
      return;
    }
    const interview: InterviewEntity = await interviewRepo.findOne({where: {id: Number(req.params.id), status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
    if (!interview) {
      next(new HttpException(404, 'Interview not found'))
      return;
    }
    if (interview.mentor) {
      next(new HttpException(400, 'Interview already confirmed'))
      return;
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      const interviewCopy = new InterviewEntity();
      interviewCopy.student = interview.student;
      interviewCopy.status = InterviewStatus.cancelled;
      interviewCopy.startDate = interview.startDate;
      interviewCopy.endDate = interview.endDate;
      await interviewCopy.save();

      interview.mentor = req.session.user;
      interview.startDate = req.body.startDate;
      interview.endDate = req.body.endDate;
      await interview.save();
      const otherStudentInterviews = await interviewRepo.find({where: {id: Not(Number(req.params.id)), student: {discordID: interview.student.discordID}, status: Not(InterviewStatus.cancelled)}});
      otherStudentInterviews.forEach(interview => {interview.status = InterviewStatus.cancelled;});
      await interviewRepo.save(otherStudentInterviews)
    })

    res.json({});
  }

  async cancelInterview(req: Request, res: Response, next: NextFunction) {
    const interviewRepo = dataSource.getRepository(InterviewEntity);
    if (!isMentor(req.session)) {
      next(new HttpException(403, 'Only mentors can cancel interviews'))
      return;
    }
    const interview: InterviewEntity = await interviewRepo.findOne({where: {id: Number(req.params.id), status: Not(InterviewStatus.cancelled)}, relations: ['student', 'mentor']});
    if (!interview) {
      next(new HttpException(404, 'Interview not found'))
      return;
    }
    if (!interview.mentor) {
      next(new HttpException(400, 'Interview is not confirmed'))
      return;
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      await interview.remove();
      const otherStudentInterviews = await interviewRepo.find({where: {id: Not(Number(req.params.id)), student: {discordID: interview.student.discordID}, status: InterviewStatus.cancelled}});
      otherStudentInterviews.forEach(interview => {interview.status = InterviewStatus.pending;});
      await interviewRepo.save(otherStudentInterviews)
    })

    res.json({});
  }
}

export default InterviewController;
