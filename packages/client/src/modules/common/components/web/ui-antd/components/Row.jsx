import React from 'react';
import PropTypes from 'prop-types';
import ADRow from 'antd/lib/row';

const Row = ({ children, ...props }) => {
  return <ADRow {...props}>{children}</ADRow>;
};

Row.propTypes = {
  children: PropTypes.node
};

export default Row;
