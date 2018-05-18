import { expect } from 'chai';
import { step } from 'mocha-steps';
import Renderer from '../../../testHelpers/Renderer';
import Routes from '../../../app/Routes';

describe('ProductType UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('ProductType page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/productType');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});
