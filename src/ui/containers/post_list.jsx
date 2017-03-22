import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'

import log from '../../log'
import POSTS_QUERY from '../graphql/posts_get.graphql'

class PostList extends React.Component {

  renderPosts() {
    const { postsQuery } = this.props;

    return postsQuery.edges.map(({ node: { id, title } }) => {
      return (
        <a href="#" className="list-group-item" key={id}>{title}</a>
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
  postsQuery: React.PropTypes.object,
};

const PostListWithApollo = withApollo(compose(
  graphql(POSTS_QUERY, {
    options: (props) => {
      let after = props.endCursor || 0;
      return {
        variables: { first: 10, after: after },
      };
    },
    props({data: {loading, postsQuery}}) {
      return {loading, postsQuery};
    }
  })
)(PostList));

export default PostListWithApollo;