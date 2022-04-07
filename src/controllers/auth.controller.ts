import { NextFunction, Request, Response } from 'express';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '@/config';
import axios from 'axios';
class AuthController {
  public exchangeCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.body.code;
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', REDIRECT_URI);

      const tokenRes = await axios
        .post('https://discord.com/api/oauth2/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .catch(err => {
          throw err.response;
        });
      res.status(200).json({ data: tokenRes.data, message: 'exchangeToken' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refToken = req.body.refreshToken;
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refToken);

      const tokenRes = await axios
        .post('https://discord.com/api/oauth2/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .catch(err => {
          throw err.response;
        });
      res.status(200).json({ data: tokenRes.data, message: 'refreshToken' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
