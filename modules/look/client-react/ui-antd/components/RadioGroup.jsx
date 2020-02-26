import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

const ADRadioGroup = Radio.Group;

const RadioGroup = ({ children, ...props }) => {
  return <ADRadioGroup {...props}>{children}</ADRadioGroup>;
};

RadioGroup.propTypes = {
  children: PropTypes.node
};

export default RadioGroup;
