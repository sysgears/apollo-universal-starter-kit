import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { Link } from 'react-router-dom'
import { Form, FormGroup, Label, Input, ListGroup, ListGroupItem, Button } from 'reactstrap'

import CommentForm from './post_comment_form'

import log from '../../log'
import POST_EDIT from '../graphql/post_edit.graphql'
import COMMENT_DELETE from '../graphql/post_comment_delete.graphql'
import POST_QUERY from '../graphql/post_get.graphql'

class PostEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: '', content: '', comment: { id: null, content: '' } };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.post.title, content: nextProps.post.content });
  }

  renderComments() {
    const { post: { comments }, deleteComment } = this.props;

    return comments.map(comment => {
      return (
        <ListGroupItem className="justify-content-between" key={comment.id}>
          {comment.content}
          <div>
            <span className="badge badge-default badge-pill" onClick={event => this.setState({ comment })}>Edit</span>
            <span className="badge badge-default badge-pill" onClick={deleteComment(comment.id)}>Delete</span>
          </div>
        </ListGroupItem>
      );
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const { post, editPost } = this.props;

    editPost(post.id, this.state.title, this.state.content);
  }

  render() {
    const { loading, match } = this.props;

    if (loading) {
      return (
        <div>{ /* loading... */ }</div>
      );
    } else {

      return (
        <div>
          <Link to="/posts">Back</Link>
          <h2>Edit Post</h2>
          <Form onSubmit={this.onSubmit.bind(this)}>
            <FormGroup>
              <Label>Title</Label>
              <Input type="text" onChange={event => this.setState({ title: event.target.value })}
                     value={this.state.title}/>
            </FormGroup>
            <FormGroup>
              <Label>Contnent</Label>
              <Input type="text" onChange={event => this.setState({ content: event.target.value })}
                     value={this.state.content}/>
            </FormGroup>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br/>
          <h3>Comments</h3>
          <CommentForm postId={match.params.id} comment={this.state.comment}/>
          <h1/>
          <ListGroup>{this.renderComments()}</ListGroup>
        </div>
      );
    }
  }
}

PostEdit.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  post: React.PropTypes.object,
  editPost: React.PropTypes.func.isRequired,
  deleteComment: React.PropTypes.func.isRequired,
};

const PostEditWithApollo = withApollo(compose(
  graphql(POST_QUERY, {
    options: (props) => {
      return {
        variables: { id: props.match.params.id }
      };
    },
    props({ data: { loading, post } }) {
      return { loading, post };
    }
  }),
  graphql(POST_EDIT, {
    props: ({ ownProps, mutate }) => ({
      editPost: (id, title, content) => mutate({
        variables: { id, title, content }
      }).then(() => ownProps.history.push('/posts')),
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
)(PostEdit));

export default PostEditWithApollo;