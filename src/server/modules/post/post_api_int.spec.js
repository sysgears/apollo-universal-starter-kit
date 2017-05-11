import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../test-helpers/integration_setup';
import POSTS_GET from '../../../client/modules/post/graphql/posts_get.graphql';
import POST_GET from '../../../client/modules/post/graphql/post_get.graphql';
import POST_ADD from '../../../client/modules/post/graphql/post_add.graphql';
import POST_EDIT from '../../../client/modules/post/graphql/post_edit.graphql';
import POST_DELETE from '../../../client/modules/post/graphql/post_delete.graphql';
import POSTS_SUBSCRIPTION from '../../../client/modules/post/graphql/posts_subscription.graphql';

describe('Post and comments example API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('Query post list works', async () => {
    let result = await apollo.query({ query: POSTS_GET, variables: { limit: 1, after: 0 } });

    expect(result.data).to.deep.equal({
      postsQuery: {
        totalCount: 20,
        edges: [{
          cursor: "20",
          node: {id: "20", title: "Post title 20", content: "Post content 20", __typename: "Post"},
          __typename: "Edges"
        }],
        pageInfo: {endCursor: "20", hasNextPage: true, __typename: "PageInfo"},
        __typename: "PostsQuery"
      }
    });
  });

  step('Query single post with comments works', async() => {
    let result = await apollo.query({ query: POST_GET, variables: { id: "1" }});

    expect(result.data).to.deep.equal({
      post: {
        id: "1",
        title: "Post title 1",
        content: "Post content 1",
        __typename: "Post",
        comments: [
          {id: "1", content: "Comment title 1 for post 1", __typename: "Comment"},
          {id: "2", content: "Comment title 2 for post 1", __typename: "Comment"}
        ]
      }
    });
  });

  step('Publishes post on add', done => {
    apollo.mutate({ mutation: POST_ADD,
      variables: {
        input: {
          title: "New post 1",
          content: "New post content 1"
        }
      }
    });

    let subscription;

    subscription = apollo.subscribe({
      query: POSTS_SUBSCRIPTION,
      variables: { endCursor: 10 },
    }).subscribe({
      next(data) {
        expect(data).to.deep.equal({
          postsUpdated: {
            mutation: 'CREATED',
            node:
            {
              id: '21',
              title: 'New post 1',
              content: 'New post content 1',
              __typename: 'Post'
            },
            __typename: 'UpdatePostPayload'
          }
        });
        subscription.unsubscribe();
        done();
      }
    });
  });

  step('Adding post works', async () => {
    let result = await apollo.query({ query: POSTS_GET, variables: { limit: 1, after: 0 }, fetchPolicy: 'network-only' });
    expect(result.data.postsQuery).to.have.property("totalCount", 21);
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.title", "New post 1");
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.content", "New post content 1");
  });

  step('Publishes post on update', done => {
    apollo.mutate({
      mutation: POST_EDIT,
      variables: {
        input: {
          id: '21',
          title: "New post 2",
          content: "New post content 2"
        }
      }
    });

    let subscription;

    subscription = apollo.subscribe({
      query: POSTS_SUBSCRIPTION,
      variables: { endCursor: 10 },
    }).subscribe({
      next(data) {
        expect(data).to.deep.equal({
          postsUpdated: {
            mutation: 'UPDATED',
            node: {
              id: '21',
              title: 'New post 2',
              content: 'New post content 2',
              __typename: 'Post'
            },
            __typename: 'UpdatePostPayload'
          }
        });
        subscription.unsubscribe();
        done();
      }
    });
  });

  step('Updating post works', async () => {
    let result = await apollo.query({ query: POSTS_GET, variables: { limit: 1, after: 0 }, fetchPolicy: 'network-only' });
    expect(result.data.postsQuery).to.have.property("totalCount", 21);
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.title", "New post 2");
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.content", "New post content 2");
  });

  step('Publishes post on removal', done => {
    apollo.mutate({ mutation: POST_DELETE,
      variables: { id: "21" }
    });

    let subscription;

    subscription = apollo.subscribe({
      query: POSTS_SUBSCRIPTION,
      variables: { endCursor: 10 },
    }).subscribe({
      next(data) {
        expect(data).to.deep.equal({
          postsUpdated: {
            mutation: 'DELETED',
            node:
            {
              id: '21',
              title: 'New post 2',
              content: 'New post content 2',
              __typename: 'Post'
            },
            __typename: 'UpdatePostPayload'
          }
        });
        subscription.unsubscribe();
        done();
      }
    });
  });

  step('Deleting post works', async () => {
    let result = await apollo.query({ query: POSTS_GET, variables: { limit: 2, after: 0 }, fetchPolicy: 'network-only' });
    expect(result.data.postsQuery).to.have.property("totalCount", 20);
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.title", "Post title 20");
    expect(result.data.postsQuery).to.have.deep.property("edges[0].node.content", "Post content 20");
  });
});