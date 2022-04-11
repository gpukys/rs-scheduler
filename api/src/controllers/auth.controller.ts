import { NextFunction, Request, Response } from 'express';
import DiscordService from '@/services/discord.service';
import { RS_SCHOOL_GUILD_ID, RS_SCHOOL_MENTOR_ID, RS_SCHOOL_MODERATOR_ID } from '@/constants/discord.constants';
import { Role } from '@/models';

class AuthController {
  
  discordService = new DiscordService();

  getUser(req: Request, res: Response) {
    const user = req.session.user ?? null;
    res.status(200).json({ user });
  }

  async discordLogin(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code as string;
    const accessToken = await this.discordService.getAccessToken(code);

    if (accessToken) {
      const discordRoles = await this.discordService.getMemberRolesInGuild(RS_SCHOOL_GUILD_ID, accessToken);

      if (discordRoles) {
        const roles = this.getFormattedDiscordRoles(discordRoles);
        const user = await this.discordService.getUser(accessToken);

        // Assign user roles
        user.roles = roles;

        // Update the session
        req.session.user = user;

        res.status(200).json({ user });
      } else {
        next(new Error('Such user does not exist in the given guild.'));
      }
    } else {
      next(new Error('Could not retrieve an access token.'));
    }
  }

  logout(req: Request, res: Response) {
    req.session.destroy(() => {
      res.status(200).send();
    });
  }

  private getFormattedDiscordRoles(discordRoles: string[]): Role[] {
    const roles = [];

    if (discordRoles.includes(RS_SCHOOL_MENTOR_ID)) {
      roles.push(Role.MENTOR)
    } else if (discordRoles.includes(RS_SCHOOL_MODERATOR_ID)) {
      roles.push(Role.MODERATOR);
    } else {
      roles.push(Role.STUDENT);
    }

    return roles;
  }

}

export default AuthController;
