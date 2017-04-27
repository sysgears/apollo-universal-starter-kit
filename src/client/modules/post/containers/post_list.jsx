import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';

import POSTS_QUERY from '../graphql/posts_get.graphql';
import POSTS_SUBSCRIPTION from '../graphql/posts_subscription.graphql';
import POST_DELETE from '../graphql/post_delete.graphql';

export function AddPost(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.postsQuery.edges.some(post => node.id === post.cursor)) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'Edges'
  };

  return update(prev, {
    postsQuery: {
      totalCount: {
        $set: prev.postsQuery.totalCount + 1
      },
      edges: {
        $unshift: [edge],
      }
    }
  });
}

function DeletePost(prev, id) {
  const index = prev.postsQuery.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    postsQuery: {
      totalCount: {
        $set: prev.postsQuery.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]],
      }
    }
  });
}

class PostList extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    const { endCursor, onFetchMore } = this.props;

    if (!nextProps.loading) {
      onFetchMore(nextProps.postsQuery.pageInfo.endCursor);

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextProps.postsQuery.pageInfo.endCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToPostList(this, nextProps);
      }
    }
  }

  subscribeToPostList = (componentRef, nextProps) => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: { endCursor: nextProps.postsQuery.pageInfo.endCursor },
      updateQuery: (prev, { subscriptionData: { data: { postsUpdated: { mutation, id, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddPost(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeletePost(prev, id);
        }
        console.log(mutation, newResult.postsQuery);

        return newResult;
      },
      onError: (err) => {
        console.error('Post List - An error occurred while being subscribed: ', err, 'Subscribe again');
        componentRef.subscribeToPostEdit(componentRef);
      }
    });
  };

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  renderPosts() {
    const { postsQuery, deletePost } = this.props;

    return postsQuery.edges.map(({ node: { id, title } }) => {

      return (
        <ListGroupItem className="justify-content-between" key={id}>
          <span><Link to={`/post/${id}`}>{title}</Link></span>
          <span className="badge badge-default badge-pill" onClick={deletePost(id)}>Delete</span>
        </ListGroupItem>
      );
    });
  }

  renderLoadMore() {
    const { postsQuery, loadMoreRows } = this.props;

    if (postsQuery.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
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
  loading: PropTypes.bool.isRequired,
  postsQuery: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  onFetchMore: PropTypes.func.isRequired,
  endCursor: PropTypes.string.isRequired,
};

const PostListWithApollo = compose(
  graphql(POSTS_QUERY, {
    options: () => {
      return {
        variables: { limit: 10, after: 0 },
      };
    },
    props: ({ ownProps, data }) => {
      const { loading, postsQuery, fetchMore, subscribeToMore } = data;
      const loadMoreRows = () => {

        ownProps.onFetchMore(postsQuery.pageInfo.endCursor);

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
                edges: [...previousResult.postsQuery.edges, ...newEdges],
                pageInfo
              }
            };
          }
        });
      };

      return { loading, postsQuery, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(POST_DELETE, {
    props: ({ ownProps: { endCursor }, mutate }) => ({
      deletePost(id){
        return () => mutate({
          variables: { input: { id, endCursor } },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id: id,
              __typename: 'Post',
            },
          },
          updateQueries: {
            getPosts: (prev, { mutationResult: { data: { deletePost } } }) => {
              return DeletePost(prev, deletePost.id);
            }
          }
        });
      },
    })
  })
)(PostList);

export default connect(
  (state) => ({ endCursor: state.post.endCursor }),
  (dispatch) => ({
    onFetchMore(endCursor) {
      dispatch({
        type: 'POST_ENDCURSOR',
        value: endCursor
      });
    }
  }),
)(PostListWithApollo);
