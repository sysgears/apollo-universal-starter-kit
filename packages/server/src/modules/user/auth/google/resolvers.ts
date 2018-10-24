import * as models from '../../../../../typings/graphql';

export default (): {
  UserAuth: models.UserAuthResolvers.Resolvers;
  GoogleAuth: models.GoogleAuthResolvers.Resolvers;
} => ({
  UserAuth: {
    google(obj) {
      return obj;
    }
  },
  GoogleAuth: {
    googleId(obj) {
      return obj.googleId;
    },
    displayName(obj) {
      return obj.googleDisplayName;
    }
  }
});
