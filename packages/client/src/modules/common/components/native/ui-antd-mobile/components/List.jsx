import React from 'react';
import PropTypes from 'prop-types';
import ADList from 'antd-mobile/lib/list';

const List = ({ children, ...props }) => {
  return <ADList {...props}>{children}</ADList>;
};

List.propTypes = {
  children: PropTypes.node
};

export default List;
