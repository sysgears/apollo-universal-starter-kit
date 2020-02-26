import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

const ADTabPane = Tabs.TabPane;

const TabPane = ({ children, ...props }) => {
  return <ADTabPane {...props}>{children}</ADTabPane>;
};

TabPane.propTypes = {
  children: PropTypes.node
};

export default TabPane;
