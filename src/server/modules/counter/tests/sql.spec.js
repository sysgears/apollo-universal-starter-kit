import log from 'common/log';

import Count from '../sql';

const count = new Count();

describe('Counter', () => {
  it('should have value in database', () => {
    return count.getCount().then(result => {
      log.info('Result:', result.amount);
    });
  });
});
