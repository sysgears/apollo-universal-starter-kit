import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';

import 'rxjs/add/observable/fromPromise';
import { Subscription } from 'rxjs/Subscription';
import * as DELETE_POST from '../graphql/DeletePost.graphql';
import * as POSTS_QUERY from '../graphql/PostsQuery.graphql';
import * as POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';

export const AddPost = (prev: any, addPost: any) => {
  // ignore if duplicate
  if (addPost.id !== null && prev.edges.some((post: any) => addPost.id === post.cursor)) {
    return prev;
  }

  const edge = {
    cursor: addPost.id,
    node: addPost,
    __typename: 'PostEdges'
  };

  return {
    ...prev,
    totalCount: prev.totalCount + 1,
    edges: [edge, ...prev.edges]
  };
};

export const DeletePost = (prev: any, node: any) => {
  const deletedEdge = prev.edges.find((x: any) => x.node.id === node.id);
  // ignore if not found
  if (!deletedEdge) {
    return prev;
  }

  return {
    ...prev,
    totalCount: prev.totalCount - 1,
    edges: prev.edges.filter((edge: any) => edge !== deletedEdge)
  };
};

@Injectable()
export default class PostService {
  public subscription: Subscription;
  public endCursor: number;
  private getPostsQuery: ApolloQueryObservable<any>;

  constructor(private apollo: Apollo) {}

  public subscribeToPosts() {
    const endCursor = this.getEndCursor();
    return this.apollo.subscribe({
      query: POSTS_SUBSCRIPTION,
      variables: { endCursor }
    });
  }

  public getPosts() {
    if (!this.getPostsQuery) {
      this.getPostsQuery = this.apollo.watchQuery({
        query: POSTS_QUERY,
        fetchPolicy: 'network-only',
        variables: { limit: 10, after: 0 }
      });
    }
    return this.getPostsQuery;
  }

  public loadMoreRows() {
    const endCursor = this.getEndCursor();
    this.getPostsQuery.fetchMore({
      variables: {
        after: endCursor
      },
      updateQuery: (previousResult: any, { fetchMoreResult: { posts } }: any) => {
        const totalCount = posts.totalCount;
        const newEdges = posts.edges;
        const pageInfo = posts.pageInfo;
        this.endCursor = pageInfo.endCursor;

        return {
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
        posts: (prev: any, { mutationResult: { data: { deletePost } } }: any) => {
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
        }
      }
    });
  }

  public updateSubscription(subscription: Subscription) {
    if (this.subscription && this.subscription !== subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = subscription;
  }

  public getEndCursor() {
    return this.endCursor ? this.endCursor : 0;
  }

  public updateEndCursor(endCursor: number) {
    this.endCursor = endCursor;
  }
}
