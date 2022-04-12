import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import InterviewController from '@/controllers/interview.controller';

class InterviewRoute implements Routes {
  public path = '/interview';
  public router = Router();
  public interviewController = new InterviewController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.interviewController.getAllInterviews.bind(this.interviewController));
    this.router.post(`${this.path}/`, this.interviewController.createInterview.bind(this.interviewController));
  }
}

export default InterviewRoute;
