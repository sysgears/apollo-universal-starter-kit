import React from 'react';
import Intro from '../Intro';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<Intro />).toJSON();
  expect(rendered).toBeTruthy();
});
