import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}code`, this.authController.exchangeCode);
    this.router.post(`${this.path}refreshToken`, this.authController.refreshToken);
  }
}

export default AuthRoute;
