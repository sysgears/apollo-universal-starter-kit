import jwt from 'jsonwebtoken';
import userInstance from './sql';
import settings from '../../../../../settings';

export default async (req, res) => {
  try {
    const token = Buffer.from(req.params.token, 'base64').toString();
    const {
      user: { id }
    } = jwt.verify(token, settings.user.secret);

    await userInstance.updateActive(id, true);

    res.redirect('/login');
  } catch (e) {
    res.send('error');
  }
};
