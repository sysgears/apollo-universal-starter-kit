import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import CommentAdd from './post_comment_add'

import POST_EDIT from '../graphql/post_edit.graphql'
import POST_QUERY from '../graphql/post_get.graphql'

class PostEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: '', content: '' };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.post.title, content: nextProps.post.content });
  }

  renderComments() {
    const { post:  { comments } } = this.props;

    return comments.map(comment => {
      return (
        <div key={comment.id}>
          <small>{comment.content}</small>
        </div>
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
        <div className="mt-4 mb-4">
          <Link to="/posts">Back</Link>
          <h2>Edit Post</h2>
          <form onSubmit={this.onSubmit.bind(this)}>
            <label>Title</label>
            <input type="text" onChange={event => this.setState({ title: event.target.value })}
                   value={this.state.title}/>
            <label>Contnent</label>
            <input type="text" onChange={event => this.setState({ content: event.target.value })}
                   value={this.state.content}/>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </form>

          <h3>Comments</h3>
          <CommentAdd postId={match.params.id} />
          <div>{this.renderComments()}</div>
        </div>
      );
    }
  }
}

PostEdit.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  post: React.PropTypes.object,
  editPost: React.PropTypes.func.isRequired,
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
  })
)(PostEdit));

export default PostEditWithApollo;