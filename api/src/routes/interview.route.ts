import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import InterviewController from '@/controllers/interview.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import authorizedMiddleware from '@/middlewares/authorized.middleware';
import { ConfirmInterviewDto, CreateInterviewDto, UpdateInterviewDto } from '@/dtos/interview.dto';

class InterviewRoute implements Routes {
  public path = '/interview';
  public router = Router();
  public interviewController = new InterviewController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authorizedMiddleware(), this.interviewController.getAllInterviews.bind(this.interviewController));
    this.router.post(`${this.path}/`, authorizedMiddleware(), validationMiddleware(CreateInterviewDto), this.interviewController.createInterview.bind(this.interviewController));
    this.router.get(`${this.path}/status`, authorizedMiddleware(), this.interviewController.getCurrentStatus.bind(this.interviewController));
    this.router.post(`${this.path}/confirm/:id`, authorizedMiddleware(), validationMiddleware(ConfirmInterviewDto), this.interviewController.confirmInterview.bind(this.interviewController));
    this.router.post(`${this.path}/cancel/:id`, authorizedMiddleware(), this.interviewController.cancelInterview.bind(this.interviewController));
    this.router.get(`${this.path}/:id`, authorizedMiddleware(), this.interviewController.getInterviewById.bind(this.interviewController));
    this.router.patch(`${this.path}/:interviewId`, authorizedMiddleware(), validationMiddleware(UpdateInterviewDto), this.interviewController.patchInterview.bind(this.interviewController));
    this.router.delete(`${this.path}/:interviewId`, authorizedMiddleware(), this.interviewController.deleteInterview.bind(this.interviewController));
  }
}

export default InterviewRoute;
