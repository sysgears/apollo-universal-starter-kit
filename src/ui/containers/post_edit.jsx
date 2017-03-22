import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'

import POST_QUERY from '../graphql/post_get.graphql'

class PostEdit extends React.Component {

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

  render() {
    const { loading, post } = this.props;

    if (loading) {
      return (
        <div className="text-center">
          Loading...
        </div>
      );
    } else {

      return (
        <div className="mt-4 mb-4">
          <h2>{post.title}</h2>

          <div>{post.content}</div>

          <div>{this.renderComments()}</div>

        </div>
      );
    }
  }
}

PostEdit.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  post: React.PropTypes.object,
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
  })
)(PostEdit));

export default PostEditWithApollo;