import { Simulate } from 'react-testing-library';

export * from 'react-testing-library';

export const click = element => {
  Simulate.click(element, { button: 0 });
};
