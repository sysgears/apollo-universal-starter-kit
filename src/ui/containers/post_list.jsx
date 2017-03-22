import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'

import log from '../../log'
import POSTS_QUERY from '../graphql/posts_get.graphql'

class PostList extends React.Component {

  renderPosts() {
    const { posts } = this.props;
    return posts.map(post => {
      return (
        <a href="#" className="list-group-item" key={post.id}>{post.title}</a>
      );
    });
  }

  render() {
    const { loading } = this.props;
    if (loading) {
      return (
        <div className="text-center">
          Loading...
        </div>
      );
    } else {
      return (
        <div className="text-center mt-4 mb-4">
          {this.renderPosts()}
        </div>
      );
    }
  }
}

PostList.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  posts: React.PropTypes.array,
};

const PostListWithApollo = withApollo(compose(
  graphql(POSTS_QUERY, {
    props({data: {loading, posts}}) {
      return {loading, posts};
    }
  })
)(PostList));

export default PostListWithApollo;