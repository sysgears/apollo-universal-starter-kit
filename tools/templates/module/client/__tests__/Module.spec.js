import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('TodoList UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('TodoList page renders on mount', () => {
    app = renderer.mount();
    renderer.history.push('/todoList');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });
});