import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import PostList from '../components/PostList';

import POSTS_QUERY from '../graphql/PostsQuery.graphql';
import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import DELETE_POST from '../graphql/DeletePost.graphql';

export function AddPost(prev, node) {
  // ignore if duplicate
  if (prev.posts.edges.some(post => node.id === post.cursor)) {
    return prev;
  }

  const filteredPosts = prev.posts.edges.filter(post => post.node.id !== null);

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'PostEdges'
  };

  return update(prev, {
    posts: {
      totalCount: {
        $set: prev.posts.totalCount + 1
      },
      edges: {
        $set: [edge, ...filteredPosts]
      }
    }
  });
}

function DeletePost(prev, id) {
  const index = prev.posts.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    posts: {
      totalCount: {
        $set: prev.posts.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
}

class Post extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      const endCursor = this.props.posts ? this.props.posts.pageInfo.endCursor : 0;
      const nextEndCursor = nextProps.posts.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToPostList(nextEndCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToPostList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              postsUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddPost(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeletePost(prev, node.id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <PostList {...this.props} />;
  }
}

export default compose(
  graphql(POSTS_QUERY, {
    options: () => {
      return {
        variables: { limit: 10, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, posts, fetchMore, subscribeToMore } = data;
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            after: posts.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.posts.totalCount;
            const newEdges = fetchMoreResult.posts.edges;
            const pageInfo = fetchMoreResult.posts.pageInfo;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              posts: {
                totalCount,
                edges: [...previousResult.posts.edges, ...newEdges],
                pageInfo,
                __typename: 'Posts'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, posts, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(DELETE_POST, {
    props: ({ mutate }) => ({
      deletePost: id => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id: id,
              __typename: 'Post'
            }
          },
          updateQueries: {
            posts: (
              prev,
              {
                mutationResult: {
                  data: { deletePost }
                }
              }
            ) => {
              return DeletePost(prev, deletePost.id);
            }
          }
        });
      }
    })
  })
)(Post);
