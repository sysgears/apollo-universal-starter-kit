import { access } from '@gqlapp/authentication-server-ts';
import User from '../../sql';

const verifyThirdParty = async accessToken => {
  try {
    return fetch(`https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=${accessToken}`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.error) {
          throw new Error(json.error.message);
        }
        const profile = {
          id: json.id,
          displayName: json.name,
          firstName: json.first_name,
          lastName: json.last_name,
          email: json.email
        };
        return profile;
      });
  } catch (err) {
    throw err;
  }
};

export default () => ({
  Mutation: {
    async loginFacebookNative(
      obj,
      {
        input: { accessToken }
      },
      { req }
    ) {
      try {
        const { id, displayName, firstName, lastName, email } = await verifyThirdParty(accessToken);

        let user = await User.getUserByFbIdOrEmail(id, email);

        if (!user) {
          const [createdUserId] = await User.register({
            username: email ? email : id,
            email: email,
            isActive: true
          });
          await User.createFacebookAuth({ id, displayName, userId: createdUserId });

          await User.editUserProfile({
            id: createdUserId,
            profile: {
              firstName,
              lastName
            }
          });

          user = await User.getUser(createdUserId);
        } else if (!user.fbId) {
          await await User.createFacebookAuth({ id, displayName, userId: user.id });
        }
        const tokens = await access.grantAccess(user, req, user.passwordHash);
        return { user, tokens };
      } catch (err) {
        throw err;
      }
    }
  }
});
