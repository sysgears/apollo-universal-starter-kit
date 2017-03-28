import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'

import PostForm from '../components/post_form'
import PostComments from './post_comments'

import POST_EDIT from '../graphql/post_edit.graphql'
import POST_QUERY from '../graphql/post_get.graphql'

class PostEdit extends React.Component {
  onSubmit(values) {
    const { post, editPost } = this.props;

    editPost(post.id, values.title, values.content);
  }

  render() {
    const { loading, post, match } = this.props;

    if (loading) {
      return (
        <div>{ /* loading... */ }</div>
      );
    } else {
      return (
        <div>
          <Link to="/posts">Back</Link>
          <h2>Edit Post</h2>
          <PostForm onSubmit={this.onSubmit.bind(this)} initialValues={post}/>
          <br/>
          <PostComments postId={match.params.id} comments={post.comments}/>
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