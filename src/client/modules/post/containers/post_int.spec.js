import Renderer from 'client/test-helpers/apollo-renderer';

import chai from 'chai';
import { step } from 'mocha-steps';

import routes from 'client/app/routes';

chai.should();

const mocks = {
  Query: () => ({
    postsQuery(obj, { limit, after }, context) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
        edges.push({
          cursor: i,
          node: {
            id: i,
            title: `Post title ${i}`,
            content: `Post content ${i}`
          }
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true
        },
      }
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
});