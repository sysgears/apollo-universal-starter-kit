import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReduxCounterButton, ReduxCounterView } from '../components/ReduxCounterView';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

interface CounterProps {
  t: TranslateFunction;
  onReduxIncrement: (increment: number) => () => void;
  reduxCount: number;
}

const ReduxCounter = ({ t }: CounterProps) => {
  const reduxCount = useSelector((state: any) => state.counter.reduxCount);
  const dispatch = useDispatch();

  const onReduxIncrement = (incrementAmount: number): (() => void) => {
    return () =>
      dispatch({
        type: 'COUNTER_INCREMENT',
        value: Number(incrementAmount)
      });
  };

  return (
    <ReduxCounterView text={t('text', { reduxCount })}>
      <ReduxCounterButton text={t('btnLabel')} onClick={onReduxIncrement(1)} />
    </ReduxCounterView>
  );
};

export default translate('reduxCounter')(ReduxCounter);
