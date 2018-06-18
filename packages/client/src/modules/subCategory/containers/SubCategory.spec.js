import { expect } from 'chai';
import { step } from 'mocha-steps';
import Renderer from '../../../testHelpers/Renderer';
import Routes from '../../../app/Routes';

describe('SubCategory UI works', () => {
  const renderer = new Renderer({});
  let app;
  let content;

  step('SubCategory page renders on mount', () => {
    app = renderer.mount(Routes);
    renderer.history.push('/subCategory');
    content = app.find('#content');
    expect(content).to.not.be.empty;
  });
});
