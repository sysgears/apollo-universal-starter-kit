import { ApolloError } from 'apollo-client';
import { graphql, OptionProps } from 'react-apollo';
import update from 'immutability-helper';

import { Post, PostQueryResult, PostOperation, PostProps, PostsUpdatedResult } from '../../types';
import { Edge, SubscriptionResult } from '../../../../../../common/types';

import POSTS_QUERY from '../PostsQuery.graphql';
import DELETE_POST from '../DeletePost.graphql';
import POST_QUERY from '../PostQuery.graphql';
import ADD_POST from '../AddPost.graphql';
import EDIT_POST from '../EditPost.graphql';
import POST_SUBSCRIPTION from '../PostSubscription.graphql';
import POSTS_SUBSCRIPTION from '../PostsSubscription.graphql';

interface PostEdge<T> extends Edge<T> {
  __typename: string;
}

function AddPost(prev: PostQueryResult, node: Post) {
  // ignore if duplicate
  if (prev.posts.edges.some((post: any) => node.id === post.cursor)) {
    return prev;
  }

  const filteredPosts: Array<Edge<Post>> = prev.posts.edges.filter((post: any) => post.node.id !== null);
  const edge: PostEdge<Post> = {
    cursor: node.id,
    node,
    __typename: 'Post'
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

const withPostList = graphql(POSTS_QUERY, {
  options: () => {
    return {
      variables: { limit: 10, after: 0 }
    };
  },
  props: ({ data }: OptionProps<any, PostQueryResult>) => {
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
});

const withPostDeleting = graphql(DELETE_POST, {
  props: ({ mutate }: OptionProps<PostProps, PostOperation>) => ({
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
});

const withPost = graphql(POST_QUERY, {
  options: ({ match, navigation }) => {
    let id: number = 0;
    if (match) {
      id = match.params.id;
    } else if (navigation) {
      id = navigation.state.params.id;
    }

    return {
      variables: { id }
    };
  },
  props({ data: { loading, error, post, subscribeToMore } }: OptionProps<PostProps, PostQueryResult>) {
    if (error) {
      throw new ApolloError(error);
    }
    return { loading, post, subscribeToMore };
  }
});

const withPostAdding = graphql(ADD_POST, {
  props: ({ ownProps: { history, navigation }, mutate }: OptionProps<PostProps, PostOperation>) => ({
    addPost: async (title: string, content: string) => {
      const { data }: any = await mutate({
        variables: { input: { title, content } },
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            id: null,
            title,
            content,
            comments: []
          }
        },
        updateQueries: {
          posts: (prev: PostQueryResult, { mutationResult: { data: { addPost } } }) => {
            return AddPost(prev, addPost);
          }
        }
      });
      if (history) {
        return history.push('/post/' + data.addPost.id, {
          post: data.addPost
        });
      } else if (navigation) {
        return navigation.setParams({
          id: data.addPost.id,
          post: data.addPost
        });
      }
    }
  })
});

const withPostEditing = graphql(EDIT_POST, {
  props: ({ ownProps: { history, navigation }, mutate }: OptionProps<PostProps, PostOperation>) => ({
    editPost: async (id: number, title: string, content: string) => {
      await mutate({
        variables: { input: { id, title, content } }
      });
      if (history) {
        return history.push('/posts');
      }
      if (navigation) {
        return navigation.goBack();
      }
    }
  })
});

function getSubscriptionOptions(endCursor: number) {
  return {
    document: POSTS_SUBSCRIPTION,
    variables: { endCursor },
    updateQuery: (
      prev: PostQueryResult,
      { subscriptionData: { data: { postsUpdated: { mutation, node } } } }: SubscriptionResult<PostsUpdatedResult>
    ) => {
      let newResult: PostQueryResult = prev;
      if (mutation === 'CREATED') {
        newResult = AddPost(prev, node);
      } else if (mutation === 'DELETED') {
        newResult = DeletePost(prev, node.id);
      }

      return newResult;
    }
  };
}

function getSubscriptionPostOptions(postId: number) {
  return {
    document: POST_SUBSCRIPTION,
    variables: { id: postId }
  };
}

export { AddPost, DeletePost };
export { withPostList, withPostDeleting };
export { withPost, withPostAdding, withPostEditing };
export { getSubscriptionOptions, getSubscriptionPostOptions };
