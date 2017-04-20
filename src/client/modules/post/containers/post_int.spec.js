import Renderer from 'client/test-helpers/apollo-renderer';
import chai from 'chai';
import { step } from 'mocha-steps';
import routes from 'client/app/routes';

chai.should();

describe('Posts and comments example UI works', () => {
  const renderer = new Renderer({}, {});
  let app;
  let content;

  step('Posts page renders without data', () => {
    app = renderer.mount(routes);
    renderer.history.push('/posts');
    content = app.find('#content');
    content.children().html().should.equal('<div></div>');
  });
});