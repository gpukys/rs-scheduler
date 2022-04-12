import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/discord-login`, this.authController.discordLogin.bind(this.authController));
    this.router.get(`${this.path}/user`, this.authController.getUser.bind(this.authController));
    this.router.post(`${this.path}/logout`, this.authController.logout.bind(this.authController));
  }
}

export default AuthRoute;
