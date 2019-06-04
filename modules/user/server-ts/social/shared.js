import { access } from '@gqlapp/authentication-server-ts';
import User from '../sql';

export async function onAuthenticationSuccess(req, res) {
  const user = await User.getUserWithPassword(req.user.id);
  const redirectUrl = req.query.state;
  const tokens = await access.grantAccess(user, req, user.passwordHash);
  const stringifyTokens = `${tokens ? '?data=' + JSON.stringify({ tokens }) : ''}`;

  if (redirectUrl) {
    res.redirect(`${redirectUrl}${stringifyTokens}`);
  } else {
    res.redirect(`/login${stringifyTokens}`);
  }
}

export const registerUser = async ({ id, username, displayName, emails: [{ value }] }) => {
  return User.register({
    username: username || displayName,
    email: value,
    password: id,
    isActive: true
  });
};
