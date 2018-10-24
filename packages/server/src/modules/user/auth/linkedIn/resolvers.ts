import * as models from '../../../../../typings/graphql';

export default (): {
  UserAuth: models.UserAuthResolvers.Resolvers;
  LinkedInAuth: models.LinkedInAuthResolvers.Resolvers;
} => ({
  UserAuth: {
    linkedin(obj) {
      return obj;
    }
  },
  LinkedInAuth: {
    lnId(obj) {
      return obj.lnId;
    },
    displayName(obj) {
      return obj.lnDisplayName;
    }
  }
});
