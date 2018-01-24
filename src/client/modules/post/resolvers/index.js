import COMMENT_QUERY_CLIENT from '../graphql/CommentQuery.client.graphql';

const TYPE_NAME = 'CommentState';

const defaults = {
  commentState: {
    id: 2,
    content: 'test',
    __typename: TYPE_NAME
  }
};

const resolvers = {
  Query: {
    commentState: (_, args, { cache }) => {
      const { commentState: { comment } } = cache.readQuery({ query: COMMENT_QUERY_CLIENT });
      return {
        comment: comment,
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    addCommentClient: async (_, { commentState }, { cache }) => {
      await cache.writeData({
        data: {
          commentState: {
            ...commentState,
            __typename: TYPE_NAME
          }
        }
      });

      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
