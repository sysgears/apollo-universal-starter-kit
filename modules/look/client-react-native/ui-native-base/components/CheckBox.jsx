import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as NBCheckbox } from 'native-base';

const CheckBox = props => {
  return <NBCheckbox onPress={props.onChange || props.onPress} {...props} />;
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  onPress: PropTypes.func
};

export default CheckBox;
