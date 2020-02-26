import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ADButtonGroup = Button.Group;

const ButtonGroup = ({ children, ...props }) => {
  return <ADButtonGroup {...props}>{children}</ADButtonGroup>;
};

ButtonGroup.propTypes = {
  children: PropTypes.node
};

export default ButtonGroup;
