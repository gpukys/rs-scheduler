import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const authorizedMiddleware = (): RequestHandler => {
  return (req, res, next) => {
    if (req.session?.user) {
      next()
    } else {
      next(new HttpException(401, 'You must be logged in to perform this action'));
    }
  };
};

export default authorizedMiddleware;
