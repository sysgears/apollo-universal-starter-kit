import schema from '../api/schema';
import Count from '../sql/count';

export default () => {
  return {
    schema,
    context: {
      Count: new Count(),
    },
  };
};