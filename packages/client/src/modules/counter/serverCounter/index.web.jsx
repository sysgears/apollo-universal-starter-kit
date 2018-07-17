import resources from './locales';
import Feature from '../../connector';
import { ServerCounterView, ServerCounterButton } from './components/ServerCounterView';
import ADD_COUNTER from './graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from './graphql/CounterSubscription.graphql';
import COUNTER_QUERY from './graphql/CounterQuery.graphql';
import ServerCounterContainer from './containers/ServerCounter';

export default new Feature({
  localization: { ns: 'serverCounter', resources }
});

export {
  ServerCounterView,
  ServerCounterButton,
  ServerCounterContainer,
  ADD_COUNTER,
  COUNTER_SUBSCRIPTION,
  COUNTER_QUERY
};
