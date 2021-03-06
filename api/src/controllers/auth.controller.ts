import { NextFunction, Request, Response } from 'express';
import DiscordService from '@/services/discord.service';
import { RS_SCHOOL_GUILD_ID, RS_SCHOOL_MENTOR_ID, RS_SCHOOL_MODERATOR_ID } from '@/constants/discord.constants';
import { Role } from '@/models';
import { dataSource } from '@/databases';
import { StudentEntity } from '@/entities/student.entity';
import { MentorEntity } from '@/entities/mentor.entity';
import { HttpException } from '@/exceptions/HttpException';

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
        const entity = roles.includes(Role.MENTOR) ? MentorEntity : StudentEntity

        // Update the session
        const repository = dataSource.getRepository(entity);
        const existingUser = await repository.findOneBy({discordID: user.discordID});
        if (!existingUser) {
          const newUser = new entity();
          newUser.discordID = user.discordID;
          newUser.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
          newUser.username = user.username;
          user.color = newUser.color;
          await newUser.save();
        } else {
          user.color = existingUser.color;
        }
        req.session.user = user;
        res.status(200).json({ user });
      } else {
        next(new HttpException(400, 'You need to be a member of "rs-school-lt" to log in'));
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
