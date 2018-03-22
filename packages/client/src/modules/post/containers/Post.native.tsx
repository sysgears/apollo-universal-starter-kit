import React from 'react';
import { SubscribeToMoreOptions, ApolloError } from 'apollo-client';
import { graphql, compose, OptionProps } from 'react-apollo';
import update from 'immutability-helper';

import PostList from '../components/PostList';
import { Post } from '../types';
import { PageInfo, EntityList, Edge } from '../../../../../common/types';

import POSTS_QUERY from '../graphql/PostsQuery.graphql';
import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import DELETE_POST from '../graphql/DeletePost.graphql';

interface PostOperationResult {
  deletePost: (id: number) => any;
}

interface PostProps {
  loading: boolean;
  posts: EntityList<Post>;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
}

export interface PostQueryResult extends PostProps {
  loadMoreRows: () => EntityList<Post>;
}

export function AddPost(prev: PostQueryResult, node: Post) {
  // ignore if duplicate
  if (prev.posts.edges.some((post: any) => node.id === post.cursor)) {
    return prev;
  }

  const filteredPosts: Array<Edge<Post>> = prev.posts.edges.filter((post: any) => post.node.id !== null);

  const edge: Edge<Post> = {
    cursor: node.id,
    node
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

function DeletePost(prev: PostQueryResult, id: number) {
  const index: number = prev.posts.edges.findIndex((x: Edge<Post>) => x.node.id === id);

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

class PostComponent extends React.Component<PostProps, any> {
  public subscription: any;
  constructor(props: PostProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: PostProps) {
    if (!nextProps.loading) {
      const endCursor: number = this.props.posts ? this.props.posts.pageInfo.endCursor : 0;
      const nextEndCursor: number = nextProps.posts.pageInfo.endCursor;

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

  public componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  public subscribeToPostList = (endCursor: number) => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (prev: PostQueryResult, { subscriptionData: { data: { postsUpdated: { mutation, node } } } }) => {
        let newResult: PostQueryResult = prev;
        if (mutation === 'CREATED') {
          newResult = AddPost(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeletePost(prev, node.id);
        }

        return newResult;
      }
    });
  };

  public render() {
    return <PostList {...this.props} />;
  }
}

export default compose(
  graphql<PostQueryResult>(POSTS_QUERY, {
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
      if (error) {
        throw new ApolloError(error);
      }
      return { loading, posts, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(DELETE_POST, {
    props: ({ mutate }: OptionProps<any, PostOperationResult>) => ({
      deletePost: (id: number) => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deletePost: {
              id,
              __typename: 'Post'
            }
          },
          updateQueries: {
            posts: (prev: PostQueryResult, { mutationResult: { data: { deletePost } } }) => {
              return DeletePost(prev, deletePost.id);
            }
          }
        });
      }
    })
  })
)(PostComponent);
