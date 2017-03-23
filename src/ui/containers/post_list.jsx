import React from 'react'
import { Link } from 'react-router-dom'
import { graphql, compose, withApollo } from 'react-apollo'
import { Button } from 'reactstrap'

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

  renderLoadMore() {
    const { postsQuery, loadMoreRows } = this.props;

    if (postsQuery.pageInfo.hasNextPage) {
      return (
        <Button color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  }

  render() {
    const { loading, postsQuery } = this.props;

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
          <div>
            <small>({postsQuery.edges.length} / {postsQuery.totalCount})</small>
          </div>
          {this.renderLoadMore()}
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