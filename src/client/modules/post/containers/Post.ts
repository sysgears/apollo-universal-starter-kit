import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';

import * as DELETE_POST from '../graphql/DeletePost.graphql';
import * as POSTS_QUERY from '../graphql/PostsQuery.graphql';

export const AddPost = (prev: any, { mutationResult: { data: { addPost } } }: any) => {
  // ignore if duplicate
  if (addPost.id !== null && prev.posts.edges.some((post: any) => addPost.id === post.cursor)) {
    return prev;
  }

  const edge = {
    cursor: addPost.id,
    node: addPost,
    __typename: 'PostEdges'
  };

  return {
    posts: {
      ...prev.posts,
      totalCount: prev.posts.totalCount + 1,
      edges: [edge, ...prev.posts.edges]
    }
  };
};

const DeletePost = (prev: any, { mutationResult: { data: { deletePost } } }: any) => {
  const deletedEdge = prev.posts.edges.find((x: any) => x.node.id === deletePost.id);
  // ignore if not found
  if (!deletedEdge) {
    return prev;
  }

  return {
    posts: {
      ...prev.posts,
      totalCount: prev.posts.totalCount - 1,
      edges: prev.posts.edges.filter((edge: any) => edge !== deletedEdge)
    }
  };
};

@Injectable()
export default class PostService {
  private getPostsQuery: ApolloQueryObservable<any>;

  constructor(private apollo: Apollo) {}

  public getPosts() {
    this.getPostsQuery = this.apollo.watchQuery({
      query: POSTS_QUERY,
      variables: { limit: 10, after: 0 }
    });
    return this.getPostsQuery;
  }

  public loadMoreRows(endCursor: number) {
    this.getPostsQuery.fetchMore({
      variables: {
        after: endCursor
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { posts } }: any) => {
        const totalCount = posts.totalCount;
        const newEdges = posts.edges;
        const pageInfo = posts.pageInfo;

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
  }

  public deletePost(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_POST,
      variables: { id },
      optimisticResponse: { deletePost: { id, __typename: 'Post' } },
      updateQueries: {
        posts: DeletePost
      }
    });
  }
}
