import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm as ADPopconfirm } from 'antd';

const Popconfirm = ({ children, ...props }) => {
  return <ADPopconfirm {...props}>{children}</ADPopconfirm>;
};

Popconfirm.propTypes = {
  children: PropTypes.node
};

export default Popconfirm;
