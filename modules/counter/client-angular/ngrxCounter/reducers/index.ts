import { Action } from '@ngrx/store';

export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';

export class CounterIncrement implements Action {
  public readonly type = COUNTER_INCREMENT;
}

export type CounterActions = CounterIncrement;

export interface CounterState {
  ngrxCount: number;
}

const defaultState: CounterState = {
  ngrxCount: 1
};

export function reducer(state = defaultState, action: CounterActions) {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return { ngrxCount: state.ngrxCount + 1 };

    default:
      return state;
  }
}
