import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';
import { updateContent } from '../../../testHelpers/testUtils';

describe('$Module$ UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/$Module$');
  const content = updateContent(app.container);

  step('$Module$ page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  step('$Module$ page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the $Module$ module');
  });
});
