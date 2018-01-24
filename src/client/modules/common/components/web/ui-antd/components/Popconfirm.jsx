import React from 'react';
import PropTypes from 'prop-types';
import ADPopconfirm from 'antd/lib/popconfirm';

const Popconfirm = ({ children, ...props }) => {
  return <ADPopconfirm {...props}>{children}</ADPopconfirm>;
};

Popconfirm.propTypes = {
  children: PropTypes.node
};

export default Popconfirm;
