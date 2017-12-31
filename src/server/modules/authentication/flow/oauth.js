import uuidv4 from 'uuid';

import settings from '../../../../../settings';

import User from '../../user/lib';
import Auth from '../lib';

import { createToken, setTokenHeaders } from './token';

let loginRedirect = settings.auth.authentication.loginSuccessRedirect;

const SECRET = settings.auth.secret;

// User has authorized our application
//   we need to set the token and redirect to successful login
export const oauthCallback = async (req, res) => {
  // User should be in the database now
  const user = await Auth.getUserWithPassword(req.user.id);

  // Create the tokens and set the headers
  const refreshSecret = SECRET + user.password;
  const [token, refreshToken] = await createToken(req.user, SECRET, refreshSecret);
  setTokenHeaders(req, { token, refreshToken });

  // Send them on their way to success
  res.redirect(loginRedirect);
};

// User has successfully passed oauth,
//   now we need to set them up on our end
export const oauthLogin = async (inputUser, cb) => {
  try {
    // Has this user already registered with our application?
    //   by this OAuth provider or with the same email another way?
    let user = await Auth.searchUserByOAuthIdOrEmail(
      inputUser.oauth.provider,
      inputUser.oauth.oauthId,
      inputUser.email
    );

    // New user, we didn't find the OAuth or email in our database(s)
    if (!user) {
      // Generate a "password" which will be bcrypted and used as a part of the seed to the JWT token
      let newUser = await Auth.registerNewUser({
        email: inputUser.email,
        password: uuidv4(),
        isActive: true,
        profile: inputUser.profile
      });

      user = newUser;
    } else {
      // Update the user's profile values
      await User.updateProfile(user.id, inputUser.profile);
    }

    // Add an entry for this OAuth
    if (user.provider !== inputUser.oauth.provider) {
      await Auth.createUserOAuth(inputUser.oauth.provider, inputUser.oauth.oauthId, user.id);
    }

    // return the usual User object
    let retUser = await User.get({ id: user.id });
    return cb(null, retUser);
  } catch (err) {
    return cb(err, {});
  }
};
