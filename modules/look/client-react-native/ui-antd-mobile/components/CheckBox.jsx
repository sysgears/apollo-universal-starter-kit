import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as ADCheckbox } from 'antd-mobile-rn';

const CheckBox = props => {
  return <ADCheckbox onChange={props.onChange || props.onPress} {...props} />;
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  onPress: PropTypes.func
};

export default CheckBox;
