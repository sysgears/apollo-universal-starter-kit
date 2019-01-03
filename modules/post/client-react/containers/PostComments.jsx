import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import update from 'immutability-helper';

import PostCommentsView from '../components/PostCommentsView';

import POST_QUERY from '../graphql/PostQuery.graphql';
import ADD_COMMENT from '../graphql/AddComment.graphql';
import EDIT_COMMENT from '../graphql/EditComment.graphql';
import DELETE_COMMENT from '../graphql/DeleteComment.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';
import ADD_COMMENT_CLIENT from '../graphql/AddComment.client.graphql';
import COMMENT_QUERY_CLIENT from '../graphql/CommentQuery.client.graphql';

function AddComment(prev, node) {
  // ignore if duplicate
  if (prev.post.comments.some(comment => comment.id === node.id)) {
    return prev;
  }

  const filteredComments = prev.post.comments.filter(comment => comment.id);
  return update(prev, {
    post: {
      comments: {
        $set: [...filteredComments, node]
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
        $splice: [[index, 1]]
      }
    }
  });
}

function receivePreviousPost(client, postId) {
  return client.readQuery({
    query: POST_QUERY,
    variables: {
      id: String(postId)
    }
  });
}

function handleUpdateData(client, post, postId) {
  client.writeQuery({
    query: POST_QUERY,
    variables: {
      id: String(postId)
    },
    data: {
      post: {
        ...post,
        __typename: 'Post'
      }
    }
  });
}

class PostComments extends React.Component {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
    comment: PropTypes.object.isRequired,
    onCommentSelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.initCommentListSubscription();
  }

  componentDidUpdate(prevProps) {
    let prevPostId = prevProps.postId || null;
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.postId !== prevPostId) {
      this.subscription();
      this.subscription = null;
    }
    this.initCommentListSubscription();
  }

  componentWillUnmount() {
    this.props.onCommentSelect({ id: null, content: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initCommentListSubscription() {
    if (!this.subscription) {
      this.subscribeToCommentList(this.props.postId);
    }
  }

  subscribeToCommentList = postId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: COMMENT_SUBSCRIPTION,
      variables: { postId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              commentUpdated: { mutation, id, node }
            }
          }
        }
      ) => {
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

  render() {
    return <PostCommentsView {...this.props} />;
  }
}

const PostCommentsWithApollo = compose(
  withApollo,
  graphql(ADD_COMMENT, {
    props: ({ mutate, ownProps: { client } }) => ({
      addComment: (content, postId) =>
        mutate({
          variables: { input: { content, postId } },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: {
              __typename: 'Comment',
              id: null,
              content: content
            }
          },
          update: (prev, { data: { addComment } }) => {
            // Receive prevoius post
            const prevPost = receivePreviousPost(client, postId);

            if (prevPost.post) {
              const { post } = AddComment(prevPost, addComment);

              // Update list of comments
              handleUpdateData(client, post, postId);
            }
          }
        })
    })
  }),
  graphql(EDIT_COMMENT, {
    props: ({ mutate, ownProps: { postId } }) => ({
      editComment: (id, content) =>
        mutate({
          variables: { input: { id, postId, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            editComment: {
              __typename: 'Comment',
              id: id,
              content: content
            }
          }
        })
    })
  }),
  graphql(DELETE_COMMENT, {
    props: ({ mutate, ownProps: { postId, client } }) => ({
      deleteComment: id =>
        mutate({
          variables: { input: { id, postId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteComment: {
              __typename: 'Comment',
              id: id
            }
          },
          update: (prev, { data: { deleteComment } }) => {
            // Receive prevoius post
            const prevPost = receivePreviousPost(client, postId);

            if (prevPost.post) {
              const { post } = DeleteComment(prevPost, deleteComment.id);

              // Update list of comments
              handleUpdateData(client, post, postId);
            }
          }
        })
    })
  }),
  graphql(ADD_COMMENT_CLIENT, {
    props: ({ mutate }) => ({
      onCommentSelect: comment => {
        mutate({ variables: { comment: comment } });
      }
    })
  }),
  graphql(COMMENT_QUERY_CLIENT, {
    props: ({ data: { comment } }) => ({ comment })
  })
)(PostComments);

export default PostCommentsWithApollo;
