import { expect } from 'chai';
import { step } from 'mocha-steps';

import { minLength } from '../validation';

describe('Validation functionality works', () => {
  step('minLength validation return undefined if length of string fewer then condition', async () => {
    expect(minLength(5)('String')).to.be.equal(undefined);
  });
});
