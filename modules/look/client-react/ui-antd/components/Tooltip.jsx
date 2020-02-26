import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as ADTooltip } from 'antd';

const Tooltip = ({ children, ...props }) => {
  return <ADTooltip {...props}>{children}</ADTooltip>;
};

Tooltip.propTypes = {
  children: PropTypes.node
};

export default Tooltip;
