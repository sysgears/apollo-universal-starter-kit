import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ReduxCounterView, ReduxCounterButton } from './components/ReduxCounterView';

const ReduxCounter = ({ t, onReduxIncrement, reduxCount }) => (
  <ReduxCounterView t={t} reduxCount={reduxCount}>
    <ReduxCounterButton t={t} amount={1} onReduxIncrement={onReduxIncrement} />
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
