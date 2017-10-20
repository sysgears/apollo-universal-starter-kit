import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';

const Table = ({ children, ...props }) => {
  return <RSTable {...props}>{children}</RSTable>;
};

Table.propTypes = {
  children: PropTypes.node
};

export default Table;
