import { Action } from '@ngrx/store';

export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';

export class CounterIncrement implements Action {
  public readonly type = COUNTER_INCREMENT;
}

export type CounterActions = CounterIncrement;

export interface CounterState {
  reduxCount: number;
}

const defaultState: CounterState = {
  reduxCount: 1
};

export function reducer(state = defaultState, action: CounterActions) {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return { reduxCount: ++state.reduxCount };

    default:
      return state;
  }
}

// const defaultState = {
//   reduxCount: 1
// };

// export default function(state = defaultState, action: any) {
//   switch (action.type) {
//     case 'COUNTER_INCREMENT':
//       return {
//         ...state,
//         reduxCount: state.reduxCount + action.value
//       };

//     default:
//       return state;
//   }
// }
