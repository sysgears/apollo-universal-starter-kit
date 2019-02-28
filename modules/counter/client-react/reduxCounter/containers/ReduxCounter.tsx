import React from 'react';
import { connect } from 'react-redux';

import { ReduxCounterButton, ReduxCounterView } from '../components/ReduxCounterView';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

// ToDo: In 16.8 version The React doesn't provide hooks for work
// with the Redux connect, provider. In the future, new versions
// of these libraries might also export custom Hooks such as useRedux()
//  or useRouter()
// https://reactjs.org/docs/hooks-faq.html#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router

interface CounterProps {
  t: TranslateFunction;
  onReduxIncrement: (increment: number) => () => void;
  reduxCount: number;
}

const ReduxCounter = ({ t, onReduxIncrement, reduxCount }: CounterProps) => (
  <ReduxCounterView text={t('text', { reduxCount })}>
    <ReduxCounterButton text={t('btnLabel')} onClick={onReduxIncrement(1)} />
  </ReduxCounterView>
);

export default connect(
  (state: any) => ({ reduxCount: state.counter.reduxCount }),
  (dispatch: any) => ({
    onReduxIncrement(value: number): () => void {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value)
        });
    }
  })
)(translate('reduxCounter')(ReduxCounter));
