import COMMENT_QUERY_CLIENT from '../graphql/CommentQuery.client.graphql';
import { Comment } from '../types';

const TYPE_NAME = 'CommentState';

interface ApolloComment extends Comment {
  __typename: string;
}

interface CommentApolloState {
  comment: ApolloComment;
}

const defaults: CommentApolloState = {
  comment: {
    id: null,
    content: '',
    __typename: TYPE_NAME
  }
};

const resolvers = {
  Query: {
    commentState: (_: any, args: any, { cache }: any) => {
      const { comment: { comment } } = cache.readQuery({ query: COMMENT_QUERY_CLIENT });
      return {
        comment: {
          ...comment,
          __typename: TYPE_NAME
        }
      };
    }
  },
  Mutation: {
    onCommentSelect: async (_: any, { comment }: any, { cache }: any): Promise<any> => {
      await cache.writeData({
        data: {
          comment: {
            ...comment,
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
