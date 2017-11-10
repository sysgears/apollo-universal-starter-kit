import React from 'react';
import PropTypes from 'prop-types';
import ADTable from 'antd/lib/table';

const Table = ({ ...props }) => {
  return <ADTable pagination={false} {...props} rowKey="id" />;
};

Table.propTypes = {
  children: PropTypes.node
};

export default Table;
