import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../../testHelpers/integrationSetup';
import POSTS_QUERY from '../../../../../client/src/modules/post/graphql/PostsQuery.graphql';
import POST_QUERY from '../../../../../client/src/modules/post/graphql/PostQuery.graphql';
import ADD_POST from '../../../../../client/src/modules/post/graphql/AddPost.graphql';
import EDIT_POST from '../../../../../client/src/modules/post/graphql/EditPost.graphql';
import DELETE_POST from '../../../../../client/src/modules/post/graphql/DeletePost.graphql';
import POSTS_SUBSCRIPTION from '../../../../../client/src/modules/post/graphql/PostsSubscription.graphql';

describe('Post and comments example API works', () => {
  let apollo: any;

  before(() => {
    apollo = getApollo();
  });

  step('Query post list works', async () => {
    const result = await apollo.query({
      query: POSTS_QUERY,
      variables: { limit: 1, after: 0 }
    });

    expect(result.data).to.deep.equal({
      posts: {
        totalCount: 20,
        edges: [
          {
            cursor: 0,
            node: {
              id: 20,
              title: 'Post title 20',
              content: 'Post content 20',
              __typename: 'Post'
            },
            __typename: 'PostEdges'
          }
        ],
        pageInfo: {
          endCursor: 0,
          hasNextPage: true,
          __typename: 'PostPageInfo'
        },
        __typename: 'Posts'
      }
    });
  });

  step('Query single post with comments works', async () => {
    const result = await apollo.query({ query: POST_QUERY, variables: { id: 1 } });

    expect(result.data).to.deep.equal({
      post: {
        id: 1,
        title: 'Post title 1',
        content: 'Post content 1',
        __typename: 'Post',
        comments: [
          {
            id: 1,
            content: 'Comment title 1 for post 1',
            __typename: 'Comment'
          },
          {
            id: 2,
            content: 'Comment title 2 for post 1',
            __typename: 'Comment'
          }
        ]
      }
    });
  });

  step('Publishes post on add', done => {
    apollo.mutate({
      mutation: ADD_POST,
      variables: {
        input: {
          title: 'New post 1',
          content: 'New post content 1'
        }
      }
    });

    const subscription = apollo
      .subscribe({
        query: POSTS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data: any) {
          expect(data).to.deep.equal({
            data: {
              postsUpdated: {
                mutation: 'CREATED',
                node: {
                  id: 21,
                  title: 'New post 1',
                  content: 'New post content 1',
                  __typename: 'Post'
                },
                __typename: 'UpdatePostPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Adding post works', async () => {
    const result = await apollo.query({
      query: POSTS_QUERY,
      variables: { limit: 1, after: 0 }
    });
    expect(result.data.posts).to.have.property('totalCount', 21);
    expect(result.data.posts).to.have.nested.property('edges[0].node.title', 'New post 1');
    expect(result.data.posts).to.have.nested.property('edges[0].node.content', 'New post content 1');
  });

  step('Publishes post on update', done => {
    apollo.mutate({
      mutation: EDIT_POST,
      variables: {
        input: {
          id: 21,
          title: 'New post 2',
          content: 'New post content 2'
        }
      }
    });

    const subscription = apollo
      .subscribe({
        query: POSTS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data: any) {
          expect(data).to.deep.equal({
            data: {
              postsUpdated: {
                mutation: 'UPDATED',
                node: {
                  id: 21,
                  title: 'New post 2',
                  content: 'New post content 2',
                  __typename: 'Post'
                },
                __typename: 'UpdatePostPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Updating post works', async () => {
    const result = await apollo.query({
      query: POSTS_QUERY,
      variables: { limit: 1, after: 0 }
    });
    expect(result.data.posts).to.have.property('totalCount', 21);
    expect(result.data.posts).to.have.nested.property('edges[0].node.title', 'New post 2');
    expect(result.data.posts).to.have.nested.property('edges[0].node.content', 'New post content 2');
  });

  step('Publishes post on removal', done => {
    apollo.mutate({
      mutation: DELETE_POST,
      variables: { id: '21' }
    });

    const subscription = apollo
      .subscribe({
        query: POSTS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data: any) {
          expect(data).to.deep.equal({
            data: {
              postsUpdated: {
                mutation: 'DELETED',
                node: {
                  id: 21,
                  title: 'New post 2',
                  content: 'New post content 2',
                  __typename: 'Post'
                },
                __typename: 'UpdatePostPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Deleting post works', async () => {
    const result = await apollo.query({
      query: POSTS_QUERY,
      variables: { limit: 2, after: 0 }
    });
    expect(result.data.posts).to.have.property('totalCount', 20);
    expect(result.data.posts).to.have.nested.property('edges[0].node.title', 'Post title 20');
    expect(result.data.posts).to.have.nested.property('edges[0].node.content', 'Post content 20');
  });
});
