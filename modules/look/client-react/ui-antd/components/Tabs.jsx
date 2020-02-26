import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as ADTabs } from 'antd';

const Tabs = ({ children, ...props }) => {
  return <ADTabs {...props}>{children}</ADTabs>;
};

Tabs.propTypes = {
  children: PropTypes.node
};

export default Tabs;
