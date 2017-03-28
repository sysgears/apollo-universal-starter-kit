import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import update from 'react-addons-update'
import { css } from 'glamor'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem, Button } from 'reactstrap'

import POSTS_QUERY from '../graphql/posts_get.graphql'
import POST_DELETE from '../graphql/post_delete.graphql'

const commentStyle = css({
  marginLeft: '10px'
});

class PostList extends React.Component {

  renderPosts() {
    const { postsQuery, deletePost } = this.props;

    return postsQuery.edges.map(({ node: { id, title, comments } }) => {

      let commentStr = '';
      if (comments.length > 0) {
        commentStr = `(${comments.length} comments)`;
      }

      return (
        <ListGroupItem className="justify-content-between" key={id}>
          <span><Link to={`/post/${id}`}>{title}</Link><small {...commentStyle}>{commentStr}</small></span>
          <span className="badge badge-default badge-pill" onClick={deletePost(id)}>Delete</span>
        </ListGroupItem>
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
        <div>{ /* loading... */ }</div>
      );
    } else {
      return (
        <div>
          <h2>Posts</h2>
          <Link to="/post/add">
            <Button color="primary">Add</Button>
          </Link>
          <h1/>
          <ListGroup>
            {this.renderPosts()}
          </ListGroup>
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
  deletePost: React.PropTypes.func.isRequired,
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
                edges: [ ...previousResult.postsQuery.edges, ...newEdges ],
                pageInfo
              }
            };
          }
        })
      };

      return { loading, postsQuery, loadMoreRows };
    }
  }),
  graphql(POST_DELETE, {
    props: ({ ownProps, mutate }) => ({
      deletePost(id){
        return () => mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id: id,
              __typename: 'Post',
            },
          },
          updateQueries: {
            getPosts: (prev, { mutationResult }) => {
              const index = prev.postsQuery.edges.findIndex(x => x.node.id == mutationResult.data.deletePost.id);

              return update(prev, {
                postsQuery: {
                  totalCount: {
                    $set: prev.postsQuery.totalCount - 1
                  },
                  edges: {
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
)(PostList));

export default PostListWithApollo;