import React from 'react';
import renderer from 'react-test-renderer';

import Intro from '../Intro';

it('renders without crashing', () => {
  const rendered = renderer.create(<Intro />).toJSON();
  expect(rendered).toBeTruthy();
});
