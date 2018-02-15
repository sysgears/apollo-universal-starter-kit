import { expect } from 'chai';
import { step } from 'mocha-steps';
import Renderer from '../../../testHelpers/Renderer';
import Routes from '../../../app/Routes';

describe('TestModule UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('TestModule page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/testModule');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});
