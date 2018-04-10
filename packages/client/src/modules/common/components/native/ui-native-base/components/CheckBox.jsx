import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox as CheckBoxComponent } from 'native-base';

const CheckBox = props => {
  return <CheckBoxComponent onPress={props.onChange || props.onPress} {...props} />;
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  onPress: PropTypes.func
};

export default CheckBox;
