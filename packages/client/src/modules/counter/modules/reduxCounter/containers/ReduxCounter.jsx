import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ReduxCounterButton, ReduxCounterView } from '../components/ReduxCounterView';

const ReduxCounter = ({ t, onReduxIncrement, reduxCount }) => (
  <ReduxCounterView text={t('reduxCounter.text', { reduxCount })}>
    <ReduxCounterButton text={t('reduxCounter.btnLabel')} onClick={onReduxIncrement(1)} />
  </ReduxCounterView>
);

ReduxCounter.propTypes = {
  t: PropTypes.func,
  onReduxIncrement: PropTypes.func,
  reduxCount: PropTypes.number
};

export default connect(
  state => ({ reduxCount: state.counter.reduxCount }),
  dispatch => ({
    onReduxIncrement(value) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value)
        });
    }
  })
)(ReduxCounter);
