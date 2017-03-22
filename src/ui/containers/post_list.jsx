import React from 'react'
import { Link } from 'react-router-dom'
import { graphql, compose, withApollo } from 'react-apollo'

import log from '../../log'
import POSTS_QUERY from '../graphql/posts_get.graphql'

class PostList extends React.Component {

  renderPosts() {
    const { postsQuery } = this.props;

    return postsQuery.edges.map(({ node: { id, title } }) => {
      const url = `/post/${id}`;

      return (
        <Link className="list-group-item" key={id} to={url}>{title}</Link>
      );
    });
  }

  render() {
    const { loading, postsQuery, loadMoreRows } = this.props;

    if (loading && !postsQuery) {
      return (
        <div className="text-center">
          Loading...
        </div>
      );
    } else {
      return (
        <div className="mt-4 mb-4">
          <h2>Posts</h2>

          <ul className="list-group">
            {this.renderPosts()}
          </ul>
          <br />
          <button type="button" className="btn btn-primary" onClick={loadMoreRows}>Load more ...</button>
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
    props: ({ ownProps, data }) => {

      const { loading, postsQuery, fetchMore } = data;

      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            after: postsQuery.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.postsQuery.totalCount;
            const newEdges = fetchMoreResult.postsQuery.edges;
            const pageInfo = fetchMoreResult.postsQuery.pageInfo;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              postsQuery: {
                totalCount,
                edges: [ ... previousResult.postsQuery.edges, ... newEdges ],
                pageInfo
              }
            };
          }
        })
      };

      return { loading, postsQuery, loadMoreRows };
    }
  })
)(PostList));

export default PostListWithApollo;