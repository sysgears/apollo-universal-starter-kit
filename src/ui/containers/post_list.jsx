import React from 'react'
import { Link } from 'react-router-dom'
import { graphql, compose, withApollo } from 'react-apollo'
import { InfiniteLoader, List } from 'react-virtualized';

import log from '../../log'
import POSTS_QUERY from '../graphql/posts_get.graphql'

let virtualizingList = [];

class PostList extends React.Component {

  isRowLoaded({ index }) {
    return !!virtualizingList[ index ];
  }

  rowRenderer({ key, index, style }) {
    let content, url;

    if (index < virtualizingList.length) {
      url = `/post/${virtualizingList[ index ].node.id}`;
      content = virtualizingList[ index ].node.title
    }
    else {
      url = '#';
      content = (
        <div>Loading...</div>
      )
    }

    return (
      <div key={key} style={style} className="list-group-item">
        <Link to={url} className="nav-link">{content}</Link>
      </div>
    )
  }

  noRowsRenderer() {
    return <h1>No Rows returned from GraphQL fetch....</h1>
  }

  render() {
    const { loading, postsQuery, loadMoreRows } = this.props;

    if (loading && virtualizingList.length == 0 ) {
      return (
        <div className="text-center">
          Loading...
        </div>
      );
    } else {

      virtualizingList = postsQuery.edges;

      return (
        <div className="mt-4 mb-4">
          <h2>Posts</h2>

          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={postsQuery.totalCount}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                height={800}
                onRowsRendered={onRowsRendered}
                noRowsRenderer={this.noRowsRenderer}
                ref={registerChild}
                rowCount={postsQuery.totalCount}
                rowHeight={40}
                rowRenderer={this.rowRenderer}
                width={500}
                overscanRowCount={0}
              />
            )}
          </InfiniteLoader>

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
        variables: { first: 20, after: after },
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
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              postsQuery: {
                totalCount,
                edges: [ ...previousResult.postsQuery.edges, ...newEdges ],
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