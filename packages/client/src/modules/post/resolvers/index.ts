import COMMENT_QUERY_CLIENT from '../graphql/comment/CommentQuery.client.graphql';
import { Comment } from '../types';
import { ApolloItem } from '../../../../../common/types';

const TYPE_NAME = 'Comment';

interface CommentApolloState {
  comment: ApolloItem<Comment>;
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
      return { comment };
    }
  },
  Mutation: {
    onCommentSelect: (_: any, { comment }: any, { cache }: any): any => {
      cache.writeData({
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
