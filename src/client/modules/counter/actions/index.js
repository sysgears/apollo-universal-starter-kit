export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
export const counterIncrement = value => ({
  type: COUNTER_INCREMENT,
  value
});

export const onReduxIncrement = value => dispatch => {
  return dispatch(counterIncrement(value));
};
