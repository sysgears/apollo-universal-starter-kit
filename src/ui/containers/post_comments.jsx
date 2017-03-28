import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { reset } from 'redux-form'
import { ListGroup, ListGroupItem } from 'reactstrap'

import CommentForm from './post_comment_form'

import COMMENT_ADD from '../graphql/post_comment_add.graphql'
import COMMENT_EDIT from '../graphql/post_comment_edit.graphql'
import COMMENT_DELETE from '../graphql/post_comment_delete.graphql'

class PostComments extends React.Component {
  constructor(props) {
    super(props);

    props.onCommentSelect({ id: null, content: '' });
  }

  renderComments() {
    const { comments, deleteComment, onCommentSelect } = this.props;

    return comments.map(({ id, content }) => {
      return (
        <ListGroupItem className="justify-content-between" key={id}>
          {content}
          <div>
            <span className="badge badge-default badge-pill" onClick={() => onCommentSelect({ id, content })}>Edit</span>
            <span className="badge badge-default badge-pill" onClick={deleteComment(id)}>Delete</span>
          </div>
        </ListGroupItem>
      );
    });
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
};

const PostCommentsWithApollo = withApollo(compose(
  graphql(COMMENT_ADD, {
    props: ({ ownProps, mutate }) => ({
      addComment: (content, postId) => mutate({
        variables: { content, postId },
        optimisticResponse: {
          addComment: {
            id: null,
            content: content,
            __typename: 'Comment',
          },
        },
        updateQueries: {
          getPost: (prev, { mutationResult }) => {
            return update(prev, {
              post: {
                comments: {
                  $push: [ mutationResult.data.addComment ],
                }
              }
            });
          }
        },
      })
    })
  }),
  graphql(COMMENT_EDIT, {
    props: ({ ownProps, mutate }) => ({
      editComment: (id, content) => mutate({
        variables: { id, content },
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
    props: ({ ownProps, mutate }) => ({
      deleteComment(id){
        return () => mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteComment: {
              id: id,
              __typename: 'Comment',
            },
          },
          updateQueries: {
            getPost: (prev, { mutationResult }) => {
              const index = prev.post.comments.findIndex(x => x.id == mutationResult.data.deleteComment.id);

              return update(prev, {
                post: {
                  comments: {
                    $splice: [ [ index, 1 ] ],
                  }
                }
              });
            }
          }
        })
      },
    })
  })
)(PostComments));

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