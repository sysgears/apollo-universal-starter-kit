import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('$Module$ UI works', () => {
  const renderer = new Renderer({});
  let app;

  step('$Module$ page renders on mount', () => {
    app = renderer.mount();
    renderer.history.push('/$Module$');
    // tslint:disable:no-unused-expression
    expect(updateContent(app.container)).to.not.be.empty;
  });
});
