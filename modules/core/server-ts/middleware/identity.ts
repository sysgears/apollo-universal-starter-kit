import * as express from 'express';
import jwt from 'jsonwebtoken';

import settings from '../../../../settings';

const identityMiddleware = (req: express.Request, res: express.Response) => {
  const authorization = req && req.headers.authorization;
  const parts = authorization && authorization.split(' ');
  const token = parts && parts.length === 2 && parts[1];
  if (token) {
    const identity = jwt.verify(token, settings.auth.secret);
    res.locals.identity = identity;
  }
};

export default identityMiddleware;
