import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import update from 'react-addons-update'
import { reset } from 'redux-form'
import { ListGroup, ListGroupItem } from 'reactstrap'

import CommentForm from '../components/post_comment_form'

import COMMENT_ADD from '../graphql/post_comment_add.graphql'
import COMMENT_EDIT from '../graphql/post_comment_edit.graphql'
import COMMENT_DELETE from '../graphql/post_comment_delete.graphql'
import COMMENT_SUBSCRIPTION from '../graphql/post_comment_subscription.graphql'

function isDuplicateComment(newComment, existingComments) {
  return newComment.id !== null && existingComments.some(comment => newComment.id === comment.id);
}

class PostComments extends React.Component {
  constructor(props) {
    super(props);

    props.onCommentSelect({ id: null, content: '' });
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.comments !== nextProps.comments) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    let commentIds = [];
    nextProps.comments.map(comment => {
      commentIds.push(parseInt(comment.id));
    });

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.systemsSub = nextProps.subscribeToMore({
        document: COMMENT_SUBSCRIPTION,
        variables: { commentIds: commentIds },
        updateQuery: (prev, { subscriptionData: { data: { commentUpdated: { mutation, node, previousValue } } } }) => {

          let newResult;

          if (mutation == 'CREATED') {

            if (isDuplicateComment(node, prev.post.comments)) {
              return prev;
            }

            newResult = update(prev, {
              post: {
                comments: {
                  $push: [ node ],
                }
              }
            });
          } else if (mutation == 'DELETED') {
            const index = prev.post.comments.findIndex(x => x.id == previousValue.id);

            if (index >= 0) {
              newResult = update(prev, {
                post: {
                  comments: {
                    $splice: [ [ index, 1 ] ],
                  }
                }
              });
            }
          } else {
            newResult = prev;
          }

          return newResult;
        },
        onError: (err) => console.error(err),
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  renderComments() {
    const { comments, onCommentSelect } = this.props;

    return comments.map(({ id, content }) => {
      return (
        <ListGroupItem className="justify-content-between" key={id}>
          {content}
          <div>
            <span className="badge badge-default badge-pill"
                  onClick={() => onCommentSelect({ id, content })}>Edit</span>
            <span className="badge badge-default badge-pill" onClick={() => this.onCommentDelete(id)}>Delete</span>
          </div>
        </ListGroupItem>
      );
    });
  }

  onCommentDelete(id) {
    const { comment, deleteComment, onCommentSelect } = this.props;

    if (comment.id === id) {
      onCommentSelect({ id: null, content: '' });
    }

    deleteComment(id);
  }

  onSubmit(values) {
    const { addComment, editComment, postId, comment, onCommentSelect, onFormSubmitted } = this.props;

    if (comment.id === null) {
      addComment(values.content, postId);
    }
    else {
      editComment(comment.id, values.content);
    }

    onCommentSelect({ id: null, content: '' });
    onFormSubmitted();
  }

  render() {
    const { postId, comment } = this.props;

    return (
      <div>
        <h3>Comments</h3>
        <CommentForm postId={postId} onSubmit={this.onSubmit.bind(this)} initialValues={comment}/>
        <h1/>
        <ListGroup>{this.renderComments()}</ListGroup>
      </div>
    );
  }
}

PostComments.propTypes = {
  postId: React.PropTypes.string.isRequired,
  comments: React.PropTypes.array.isRequired,
  comment: React.PropTypes.object.isRequired,
  addComment: React.PropTypes.func.isRequired,
  editComment: React.PropTypes.func.isRequired,
  deleteComment: React.PropTypes.func.isRequired,
  onCommentSelect: React.PropTypes.func.isRequired,
  onFormSubmitted: React.PropTypes.func.isRequired,
  subscribeToMore: React.PropTypes.func.isRequired,
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

            if (isDuplicateComment(addComment, prev.post.comments)) {
              return prev;
            }

            return update(prev, {
              post: {
                comments: {
                  $push: [ addComment ],
                }
              }
            });
          }
        },
      })
    })
  }),
  graphql(COMMENT_EDIT, {
    props: ({ mutate }) => ({
      editComment: (id, content) => mutate({
        variables: { input: { id, content } },
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
    props: ({ mutate }) => ({
      deleteComment: (id) => mutate({
        variables: { id },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteComment: {
            id: id,
            __typename: 'Comment',
          },
        },
        updateQueries: {
          getPost: (prev, { mutationResult: { data: { deleteComment } } }) => {
            const index = prev.post.comments.findIndex(x => x.id == deleteComment.id);

            if (index >= 0) {
              return update(prev, {
                post: {
                  comments: {
                    $splice: [ [ index, 1 ] ],
                  }
                }
              });
            }
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