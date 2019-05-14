import { access } from '@gqlapp/authentication-server-ts';

import User from '../../sql';

const registerUser = async (id, email) => {
  return User.register({
    username: email,
    email: email,
    password: id,
    isActive: true
  });
};

const createGoogleOAuth = async user => User.createGoogleOAuth(user);

export default () => ({
  Mutation: {
    async googleExpoLogin(
      obj,
      {
        input: { id, name, email }
      },
      { req }
    ) {
      let user = await User.getUserByGoogleIdOrEmail(id, email);

      if (!user) {
        const [createdUserId] = await registerUser(id, email);
        const [firstName, lastName] = name.split(' ');

        await createGoogleOAuth({ id, name, userId: createdUserId });

        await User.editUserProfile({
          id: createdUserId,
          profile: {
            firstName,
            lastName
          }
        });

        user = await User.getUser(createdUserId);
      } else if (!user.googleId) {
        await createGoogleOAuth({ id, name, userId: user.id });
      }

      const tokens = await access.grantAccess(user, req, user.passwordHash);

      return { ...tokens };
    }
  }
});
