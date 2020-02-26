import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';

const ADPanel = Collapse.Panel;

const Panel = ({ children, ...props }) => {
  return <ADPanel {...props}>{children}</ADPanel>;
};

Panel.propTypes = {
  children: PropTypes.node
};

export default Panel;
