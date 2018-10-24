import * as models from '../../../../../typings/graphql';

export default (): {
  UserAuth: models.UserAuthResolvers.Resolvers;
  GithubAuth: models.GithubAuthResolvers.Resolvers;
} => ({
  UserAuth: {
    github(obj) {
      return obj;
    }
  },
  GithubAuth: {
    ghId(obj) {
      return obj.ghId;
    },
    displayName(obj) {
      return obj.ghDisplayName;
    }
  }
});
