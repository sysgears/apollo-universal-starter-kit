import React from 'react';
import PropTypes from 'prop-types';
import { List as ADList } from 'antd-mobile-rn';

const List = ({ children, ...props }) => {
  return <ADList {...props}>{children}</ADList>;
};

List.propTypes = {
  children: PropTypes.node
};

export default List;
