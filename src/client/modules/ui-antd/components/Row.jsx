import React from 'react';
import PropTypes from 'prop-types';
import { Row as RSRow } from 'antd';

const Row = ({ children, ...props }) => {
  return <RSRow {...props}>{children}</RSRow>;
};

Row.propTypes = {
  children: PropTypes.node
};

export default Row;
