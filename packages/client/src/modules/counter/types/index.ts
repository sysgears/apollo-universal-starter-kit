// Since the same interfaces are used in both `*.native.tsx` and `*.web.tsx` files
// it was decided to take them here in order to avoid duplicated declarations

import { QueryProps } from 'react-apollo';

/* Entities */
export interface Counter {
  amount: number;
}

interface CounterUpdatedResult {
  counterUpdated: Counter;
}

/* Component props */

interface CounterOperation {
  addCounter: (amount: number) => any;
  addStateCounter: (amount: number) => any;
}

interface CounterQueryResult {
  counter: Counter;
}

interface StateProps {
  reduxCounter: Counter;
  stateCounter: Counter;
  onReduxIncrement: (amount: number) => any;
}

interface CounterProps extends StateProps, QueryProps, CounterQueryResult, CounterOperation {}

export { CounterOperation, CounterQueryResult, StateProps, CounterProps, CounterUpdatedResult };
