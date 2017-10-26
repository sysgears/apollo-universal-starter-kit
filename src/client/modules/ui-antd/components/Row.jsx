import React from 'react';
import PropTypes from 'prop-types';
import RSRow from 'antd/lib/row';

const Row = ({ children, ...props }) => {
  return <RSRow {...props}>{children}</RSRow>;
};

Row.propTypes = {
  children: PropTypes.node
};

export default Row;
