import * as models from '../../../../../typings/graphql';

export default (): {
  UserAuth: models.UserAuthResolvers.Resolvers;
  FacebookAuth: models.FacebookAuthResolvers.Resolvers;
} => ({
  UserAuth: {
    facebook(obj) {
      return obj;
    }
  },
  FacebookAuth: {
    fbId(obj) {
      return obj.fbId;
    },
    displayName(obj) {
      return obj.fbDisplayName;
    }
  }
});
