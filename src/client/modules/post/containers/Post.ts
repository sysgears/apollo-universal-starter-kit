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
        const { totalCount, edges, pageInfo } = posts.totalCount;
        this.endCursor = pageInfo.endCursor;

        return {
          posts: {
            totalCount,
            edges: [...previousResult.posts.edges, ...edges],
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { graphql, compose } from 'react-apollo';
// import update from 'immutability-helper';
//
// import PostList from '../components/PostList';
//
// import POSTS_QUERY from '../graphql/PostsQuery.graphql';
// import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
// import DELETE_POST from '../graphql/DeletePost.graphql';
//
// export function AddPost(prev, node) {
//   // ignore if duplicate
//   if (node.id !== null && prev.posts.edges.some(post => node.id === post.cursor)) {
//     return prev;
//   }
//
//   const edge = {
//     cursor: node.id,
//     node: node,
//     __typename: 'PostEdges'
//   };
//
//   return update(prev, {
//     posts: {
//       totalCount: {
//         $set: prev.posts.totalCount + 1
//       },
//       edges: {
//         $unshift: [edge]
//       }
//     }
//   });
// }
//
// function DeletePost(prev, id) {
//   const index = prev.posts.edges.findIndex(x => x.node.id === id);
//
//   // ignore if not found
//   if (index < 0) {
//     return prev;
//   }
//
//   return update(prev, {
//     posts: {
//       totalCount: {
//         $set: prev.posts.totalCount - 1
//       },
//       edges: {
//         $splice: [[index, 1]]
//       }
//     }
//   });
// }
//
// class Post extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.subscription = null;
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (!nextProps.loading) {
//       const endCursor = this.props.posts ? this.props.posts.pageInfo.endCursor : 0;
//       const nextEndCursor = nextProps.posts.pageInfo.endCursor;
//
//       // Check if props have changed and, if necessary, stop the subscription
//       if (this.subscription && endCursor !== nextEndCursor) {
//         this.subscription();
//         this.subscription = null;
//       }
//
//       // Subscribe or re-subscribe
//       if (!this.subscription) {
//         this.subscribeToPostList(nextEndCursor);
//       }
//     }
//   }
//
//   subscribeToPostList = endCursor => {
//     const { subscribeToMore } = this.props;
//
//     this.subscription = subscribeToMore({
//       document: POSTS_SUBSCRIPTION,
//       variables: { endCursor },
//       updateQuery: (prev, { subscriptionData: { postsUpdated: { mutation, node } } }) => {
//         let newResult = prev;
//
//         if (mutation === 'CREATED') {
//           newResult = AddPost(prev, node);
//         } else if (mutation === 'DELETED') {
//           newResult = DeletePost(prev, node.id);
//         }
//
//         return newResult;
//       }
//     });
//   };
//
//   componentWillUnmount() {
//     if (this.subscription) {
//       // unsubscribe
//       this.subscription();
//     }
//   }
//
//   render() {
//     return <PostList {...this.props} />;
//   }
// }
//
// Post.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   posts: PropTypes.object,
//   deletePost: PropTypes.func.isRequired,
//   loadMoreRows: PropTypes.func.isRequired,
//   subscribeToMore: PropTypes.func.isRequired
// };
//
// export default compose(
//   graphql(POSTS_QUERY, {
//     options: () => {
//       return {
//         variables: { limit: 10, after: 0 }
//       };
//     },
//     props: ({ data }) => {
//       const { loading, posts, fetchMore, subscribeToMore } = data;
//       const loadMoreRows = () => {
//         return fetchMore({
//           variables: {
//             after: posts.pageInfo.endCursor
//           },
//           updateQuery: (previousResult, { fetchMoreResult }) => {
//             const totalCount = fetchMoreResult.posts.totalCount;
//             const newEdges = fetchMoreResult.posts.edges;
//             const pageInfo = fetchMoreResult.posts.pageInfo;
//
//             return {
//               // By returning `cursor` here, we update the `fetchMore` function
//               // to the new cursor.
//               posts: {
//                 totalCount,
//                 edges: [...previousResult.posts.edges, ...newEdges],
//                 pageInfo,
//                 __typename: 'Posts'
//               }
//             };
//           }
//         });
//       };
//
//       return { loading, posts, subscribeToMore, loadMoreRows };
//     }
//   }),
//   graphql(DELETE_POST, {
//     props: ({ mutate }) => ({
//       deletePost: id => {
//         mutate({
//           variables: { id },
//           optimisticResponse: {
//             __typename: 'Mutation',
//             deletePost: {
//               id: id,
//               __typename: 'Post'
//             }
//           },
//           updateQueries: {
//             posts: (prev, { mutationResult: { data: { deletePost } } }) => {
//               return DeletePost(prev, deletePost.id);
//             }
//           }
//         });
//       }
//     })
//   })
// )(Post);
