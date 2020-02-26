import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as ADCollapse } from 'antd';

const Collapse = ({ children, ...props }) => {
  return <ADCollapse {...props}>{children}</ADCollapse>;
};

Collapse.propTypes = {
  children: PropTypes.node
};

export default Collapse;
