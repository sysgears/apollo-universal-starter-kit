import React from 'react';
import PropTypes from 'prop-types';
import { Table as ADTable } from 'antd';

const Table = ({ ...props }) => {
  return <ADTable pagination={false} {...props} />;
};

Table.propTypes = {
  children: PropTypes.node
};

export default Table;
