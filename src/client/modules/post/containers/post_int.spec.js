import Renderer from 'client/test-helpers/apollo-renderer';

import chai from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import routes from 'client/app/routes';
import POSTS_SUBSCRIPTION from '../graphql/posts_subscription.graphql';

chai.should();

const createNode = (id) => ({
  id: `${id}`,
  title: `Post title ${id}`,
  content: `Post content ${id}`,
  __typename: "Post"
});

const mocks = {
  Query: () => ({
    postsQuery(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
        edges.push({
          cursor: `${i}`,
          node: createNode(i),
          __typename: "Edges"
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: "PageInfo"
        },
        __typename: "PostsQuery"
      };
    }
  })
};

describe('Posts and comments example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  step('Posts page renders without data', () => {
    app = renderer.mount(routes);
    renderer.history.push('/posts');
    content = app.find('#content');
    content.children().html().should.equal('<div></div>');
  });

  step('Posts page renders with data', () => {
    content.text().should.include('Post title 1');
    content.text().should.include('Post title 2');
    content.text().should.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = content.find('#load-more');
    loadMoreButton.simulate("click");
  });

  step('Clicking load more loads more posts', () => {
    content.text().should.include('Post title 3');
    content.text().should.include('Post title 4');
    content.text().should.include('4 / 4');
  });

  step('Check subscribed to post updates', () => {
    renderer.getSubscriptions(POSTS_SUBSCRIPTION).should.has.lengthOf(1);
  });

  step('Updates post list on post delete from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(null, { postsUpdated: { mutation: 'DELETED', id: "2", node: null } });
    content.text().should.not.include('Post title 2');
    content.text().should.include('3 / 3');
  });

  step('Updates post list on post create from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(null, _.cloneDeep({ postsUpdated: { mutation: 'CREATED', id: "2", node: createNode(2) } }));
    content.text().should.include('Post title 2');
    content.text().should.include('4 / 4');
  });
});