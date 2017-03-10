import Count from '../../src/server/sql/count'
import log from '../../src/log'

const count = new Count();

describe('Counter', () => {
  it('should have value in database', () => {
    return count.getCount().then(result => {
      log.info('Result:', result.amount);
    });
  });
});
