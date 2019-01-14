import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';
import { render } from 'react-testing-library';

import Renderer from '../../../../../packages/client/src/testHelpers/Renderer';
import { click, find } from '../../../../../packages/client/src/testHelpers/testUtils';
import ReduxCounter from '../containers/ReduxCounter';
import { translate } from '@module/i18n-client-react';

chai.should();

const COUNTER_REDUX_VALUE = 1;

describe('Redux counter example UI works', () => {
  const renderer = new Renderer({}, {});
  let app: any;
  let container: any;
  let content: any;
  const ReduxCounterWithI18n = translate('counter')(ReduxCounter);

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = container.firstChild;
    }
  });

  step('Counter section renders with state data', () => {
    app = render(renderer.withApollo(<ReduxCounterWithI18n />));
    container = app.container;
    content = container.firstChild;
    content.textContent.should.has.string(`The current counter value is ${COUNTER_REDUX_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', () => {
    const reduxButton = find(container, '#redux-button');
    click(reduxButton);
    content.textContent.should.has.string(`The current counter value is ${COUNTER_REDUX_VALUE + 1}.`);
  });
});
