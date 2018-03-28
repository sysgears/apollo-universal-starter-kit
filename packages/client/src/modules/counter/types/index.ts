// Since the same interfaces are used in both `*.native.tsx` and `*.web.tsx` files
// it was decided to take them here in order to avoid duplicated declarations

import { QueryProps } from 'react-apollo';

/* --- ENTITIES --- */

export interface Counter {
  amount: number;
}

/* --- GRAPHQL TYPES --- */

// TODO: remove it after a common subscription interface is created
interface CounterUpdatedResult {
  counterUpdated: Counter;
}

/* --- COMPONENT PROPS --- */

/**
 * Mutation props
 */
interface CounterOperation {
  addCounter: (amount: number) => any;
  addStateCounter: (amount: number) => any;
  onReduxIncrement: (amount: number) => any;
}

/**
 * Query props
 */
interface CounterQueryResult {
  counter: Counter;
  reduxCounter: Counter;
  stateCounter: Counter;
}

interface CounterProps extends QueryProps, CounterQueryResult, CounterOperation {}

export { CounterOperation, CounterQueryResult, CounterProps, CounterUpdatedResult };
