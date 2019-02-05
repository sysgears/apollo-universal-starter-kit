/*eslint-disable no-unused-vars*/
import { isEmpty } from 'lodash';
import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';
import { UserInputError } from 'apollo-server-errors';

const USERS_SUBSCRIPTION = 'users_subscription';

export default pubsub => ({
  Query: {
    users: withAuth(['user:view:all'], (obj, { orderBy, filter }, { User }) => {
      return User.getUsers(orderBy, filter);
    }),
    user: withAuth(
      () => {
        return ['user:view:self'];
      },
      (obj, { id }, { user, User, req: { t } }) => {
        if (user.id === id || user.role === 'admin') {
          try {
            return { user: User.getUser(id) };
          } catch (e) {
            return { errors: e };
          }
        }

        throw new Error(t('user:accessDenied'));
      }
    ),
    currentUser(obj, args, { User, user }) {
      if (user) {
        return User.getUser(user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    addUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.input.id ? ['user:create'] : ['user:create:self'];
      },
      async (obj, { input }, { User, user, req: { t } }) => {
        const { errors, id } = await User.register(input);

        if (errors && errors.code === 'auth/email-already-exists') {
          errors.email = t('firebase:emailIsExisted');
        }

        if (errors && errors.code === 'auth/invalid-password') {
          errors.password = t('firebase:passwordLength');
        }
        if (!isEmpty(errors)) throw new UserInputError('Failed to get events due to validation errors', { errors });

        try {
          const user = await User.getUser(id);
          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'CREATED',
              node: user
            }
          });
          return { user };
        } catch (e) {
          return e;
        }
      }
    ),
    editUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.input.id ? ['user:update'] : ['user:update:self'];
      },
      async (obj, { input }, { User, user, req: { t } }) => {
        const { errors, id } = await User.editUser(input);

        if (errors && errors.code === 'auth/email-already-exists') {
          errors.email = t('firebase:emailIsExisted');
        }

        if (errors && errors.code === 'auth/invalid-password') {
          errors.password = t('firebase:passwordLength');
        }

        if (!isEmpty(errors)) throw new UserInputError('Failed to get events due to validation errors', { errors });

        try {
          const user = await User.getUser(id);
          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'UPDATED',
              node: user
            }
          });

          return { user };
        } catch (e) {
          throw e;
        }
      }
    ),
    deleteUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.id ? ['user:delete'] : ['user:delete:self'];
      },
      async (obj, { id }, { User, user, req: { t } }) => {
        const { errors, deletedUid } = await User.deleteUser(id);
        if (errors && errors.code === 'auth/user-not-found') {
          throw new Error(t('firebase:userIsNotExisted'));
        }

        if (deletedUid) {
          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'DELETED',
              node: deletedUid
            }
          });
          return { user };
        } else {
          throw new Error(t('firebase:userCouldNotDeleted'));
        }
      }
    ),
    loginWithProvider: async (obj, { input }, { User, req }) => {
      if (input.provider.isNewUser) {
        const registerInput = {
          userId: input.id,
          email: input.email,
          isActive: input.emailVerified
        };
        await User.register({ ...registerInput });
      }
      await User.registerWithProvider({
        userId: input.id,
        providerId: input.provider.providerId,
        profileId: input.provider.providerId,
        name: input.provider.name,
        link: input.provider.link
      });

      const user = await User.getUser(input.id);
      return user;
    }
  },
  Subscription: {
    usersUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(USERS_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.usersUpdated;
          const {
            filter: { isActive, role, searchText }
          } = variables;

          const checkByFilter =
            !!node.isActive === isActive &&
            (!role || role === node.role) &&
            (!searchText ||
              node.username.toUpperCase().includes(searchText.toUpperCase()) ||
              node.email.toUpperCase().includes(searchText.toUpperCase()));

          switch (mutation) {
            case 'DELETED':
              return true;
            case 'CREATED':
              return checkByFilter;
            case 'UPDATED':
              return !checkByFilter;
          }
        }
      )
    }
  }
});
