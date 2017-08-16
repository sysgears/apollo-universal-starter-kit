import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { reset } from 'redux-form';

import PostCommentsShow from '../components/post_comments_show';

import COMMENT_ADD from '../graphql/post_comment_add.graphql';
import COMMENT_EDIT from '../graphql/post_comment_edit.graphql';
import COMMENT_DELETE from '../graphql/post_comment_delete.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/post_comment_subscription.graphql';

function AddComment(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.post.comments.some(comment => node.id === comment.id)) {
    return prev;
  }

  return update(prev, {
    post: {
      comments: {
        $push: [node],
      }
    }
  });
}

function DeleteComment(prev, id) {
  const index = prev.post.comments.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    post: {
      comments: {
        $splice: [[index, 1]],
      }
    }
  });
}

class PostComments extends React.Component {
  constructor(props) {
    super(props);

    props.onCommentSelect({ id: null, content: '' });

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.postId !== nextProps.postId) {
      this.subscription = null;
    }

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.subscribeToCommentList(nextProps.postId);
    }
  }

  subscribeToCommentList = postId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: COMMENT_SUBSCRIPTION,
      variables: { postId },
      updateQuery: (prev, { subscriptionData: { data: { commentUpdated: { mutation, id, node } } } }) => {

        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddComment(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteComment(prev, id);
        }

        return newResult;
      }
    });
  };

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  render() {
    return <PostCommentsShow {...this.props} />;
  }
}

PostComments.propTypes = {
  postId: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  comment: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  onCommentSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

const PostCommentsWithApollo = compose(
  graphql(COMMENT_ADD, {
    props: ({ mutate }) => ({
      addComment: (content, postId) => mutate({
        variables: { input: { content, postId } },
        optimisticResponse: {
          addComment: {
            id: -1,
            content: content,
            __typename: 'Comment',
          },
        },
        updateQueries: {
          getPost: (prev, { mutationResult: { data: { addComment } } }) => {
            return AddComment(prev, addComment);
          }
        },
      })
    })
  }),
  graphql(COMMENT_EDIT, {
    props: ({ ownProps: { postId }, mutate }) => ({
      editComment: (id, content) => mutate({
        variables: { input: { id, postId, content } },
        optimisticResponse: {
          __typename: 'Mutation',
          editComment: {
            id: id,
            content: content,
            __typename: 'Comment',
          },
        }
      }),
    })
  }),
  graphql(COMMENT_DELETE, {
    props: ({ ownProps: { postId }, mutate }) => ({
      deleteComment: (id) => mutate({
        variables: { input: { id, postId } },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteComment: {
            id: id,
            __typename: 'Comment',
          },
        },
        updateQueries: {
          getPost: (prev, { mutationResult: { data: { deleteComment } } }) => {
            return DeleteComment(prev, deleteComment.id);
          }
        }
      }),
    })
  })
)(PostComments);

export default connect(
  (state) => ({ comment: state.post.comment }),
  (dispatch) => ({
    onCommentSelect(comment) {
      dispatch({
        type: 'COMMENT_SELECT',
        value: comment
      });
    },
    onFormSubmitted() {
      dispatch(reset('comment'));
    }
  }),
)(PostCommentsWithApollo);
