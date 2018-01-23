import COMMENT_QUERY_CLIENT from '../graphql/CommentQuery.client.graphql';

const TYPE_NAME = 'CommentState';
const COMMENT_CLIENT = 'CommentClient';

const defaults = {
  commentState: {
    comment: {
      id: null,
      content: '',
      __typename: COMMENT_CLIENT
    }
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
    addCommentClient: async (_, { comment }, { cache }) => {
      //const { comment } = cache.readQuery({ query: COMMENT_QUERY_CLIENT });
      //
      // //const newAmount = amount + counter;
      //
      await cache.writeData({
        data: {
          commentState: {
            comment: comment,
            __typename: COMMENT_CLIENT
          }
        }
      });
      return {
        data: {
          commentState: {
            comment: comment,
            __typename: COMMENT_CLIENT
          }
        }
      };
    }
  }
};

export default {
  defaults,
  resolvers
};
