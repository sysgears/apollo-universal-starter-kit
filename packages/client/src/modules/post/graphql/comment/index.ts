import { graphql, compose, OptionProps } from 'react-apollo';
import update from 'immutability-helper';

import { Comment, CommentOperation, PostQueryResult, CommentQueryResult, PostCommentsProps } from '../../types';
import { SubscriptionResult } from '../../../../../../common/types';

import ADD_COMMENT from './AddComment.graphql';
import EDIT_COMMENT from './EditComment.graphql';
import DELETE_COMMENT from './DeleteComment.graphql';
import ADD_COMMENT_CLIENT from './AddComment.client.graphql';
import COMMENT_QUERY_CLIENT from './CommentQuery.client.graphql';
import COMMENT_SUBSCRIPTION from './CommentSubscription.graphql';

function AddComment(prev: PostQueryResult, node: Comment) {
  // ignore if duplicate
  if (prev.post.comments.some((comment: Comment) => comment.id === node.id)) {
    return prev;
  }
  const filteredComments: Comment[] = prev.post.comments.filter((comment: Comment) => comment.id);
  return update(prev, {
    post: {
      comments: {
        $set: [...filteredComments, node]
      }
    }
  });
}

function DeleteComment(prev: PostQueryResult, id: number) {
  const index: number = prev.post.comments.findIndex((comment: Comment) => comment.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    post: {
      comments: {
        $splice: [[index, 1]]
      }
    }
  });
}

const withCommentAdding = graphql(ADD_COMMENT, {
  props: ({ mutate }: OptionProps<any, CommentOperation>) => ({
    addComment: (content: string, postId: number) =>
      mutate({
        variables: { input: { content, postId } },
        optimisticResponse: {
          __typename: 'Mutation',
          addComment: {
            __typename: 'Comment',
            id: null,
            content
          }
        },
        updateQueries: {
          post: (prev: PostQueryResult, { mutationResult: { data: { addComment } } }) => {
            if (prev.post) {
              return AddComment(prev, addComment);
            }
          }
        }
      })
  })
});

const withCommentEditing = graphql(EDIT_COMMENT, {
  props: ({ ownProps: { postId }, mutate }: OptionProps<PostCommentsProps, CommentOperation>) => ({
    editComment: (id: number, content: string) =>
      mutate({
        variables: { input: { id, postId, content } },
        optimisticResponse: {
          __typename: 'Mutation',
          editComment: {
            __typename: 'Comment',
            id,
            content
          }
        }
      })
  })
});

const withCommentDeleting = graphql(DELETE_COMMENT, {
  props: ({ ownProps: { postId }, mutate }: OptionProps<PostCommentsProps, CommentOperation>) => ({
    deleteComment: (id: number) =>
      mutate({
        variables: { input: { id, postId } },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteComment: {
            __typename: 'Comment',
            id
          }
        },
        updateQueries: {
          post: (prev: PostQueryResult, { mutationResult: { data: { deleteComment } } }) => {
            if (prev.post) {
              return DeleteComment(prev, deleteComment.id);
            }
          }
        }
      })
  })
});

const withCommentState = compose(
  graphql(ADD_COMMENT_CLIENT, {
    props: ({ mutate }: OptionProps<PostCommentsProps, CommentOperation>) => ({
      onCommentSelect: (comment: Comment) => {
        mutate({ variables: { comment } });
      }
    })
  }),
  graphql(COMMENT_QUERY_CLIENT, {
    props: ({ data: { comment } }: OptionProps<PostCommentsProps, CommentQueryResult>) => ({ comment })
  })
);

function getSubscriptionCommentOptions(postId: number) {
  return {
    document: COMMENT_SUBSCRIPTION,
    variables: { postId },
    updateQuery: (
      prev: PostQueryResult,
      { subscriptionData: { data: { commentUpdated: { mutation, id, node } } } }: SubscriptionResult<Comment>
    ) => {
      let newResult: PostQueryResult = prev;

      if (mutation === 'CREATED') {
        newResult = AddComment(prev, node);
      } else if (mutation === 'DELETED') {
        newResult = DeleteComment(prev, id);
      }

      return newResult;
    }
  };
}

export { getSubscriptionCommentOptions };
export { withCommentAdding, withCommentEditing, withCommentDeleting, withCommentState };
