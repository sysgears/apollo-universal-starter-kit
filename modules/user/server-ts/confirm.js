import jwt from 'jsonwebtoken';
import User from './sql';
import settings from '../../../settings';

export default async (req, res, next) => {
  try {
    const token = Buffer.from(req.params.token, 'base64').toString();
    const result = jwt.verify(token, settings.auth.secret);

    await User.updateActive(result.identity.id, true);

    res.redirect('/login/?email-verified');
  } catch (e) {
    next(e);
  }
};
