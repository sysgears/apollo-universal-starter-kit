import React from 'react';
import PropTypes from 'prop-types';
import { Row as ADRow } from 'antd';

const Row = ({ children, ...props }) => {
  return <ADRow {...props}>{children}</ADRow>;
};

Row.propTypes = {
  children: PropTypes.node
};

export default Row;
