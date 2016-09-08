import Count from './count'
import log from '../../log'

const count = new Count();

describe('Counter', () => {
  it('should have value in database', () => {
    return count.getCount().then(result => {
      log.info('Result:', result.amount);
    });
  });
});
