import { access } from '@gqlapp/authentication-server-ts';
import User from '../sql';

export async function onAuthenticationSuccess(req, res) {
  const user = await User.getUserWithPassword(req.user.id);
  const redirectUrl = req.query.state;
  const tokens = await access.grantAccess(user, req, user.id + (user.passwordHash || ''));

  if (redirectUrl) {
    res.redirect(redirectUrl + (tokens ? '?data=' + JSON.stringify({ tokens }) : ''));
  } else {
    res.redirect('/profile');
  }
}

export const registerUser = async ({ username, displayName, emails: [{ value }] }) => {
  return User.register({
    username: username || displayName,
    email: value,
    isActive: true
  });
};
