import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as CheckBoxComponent } from 'antd-mobile/lib/';

const CheckBox = props => {
  return <CheckBoxComponent onChange={props.onChange || props.onPress} {...props} />;
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  onPress: PropTypes.func
};

export default CheckBox;
