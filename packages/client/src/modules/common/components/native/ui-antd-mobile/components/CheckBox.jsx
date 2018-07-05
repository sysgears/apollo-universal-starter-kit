import React from 'react';
import PropTypes from 'prop-types';
import ADCheckbox from 'antd-mobile/lib/checkbox';

const CheckBox = props => {
  return <ADCheckbox onChange={props.onChange || props.onPress} {...props} />;
};

CheckBox.propTypes = {
  onChange: PropTypes.func,
  onPress: PropTypes.func
};

export default CheckBox;
