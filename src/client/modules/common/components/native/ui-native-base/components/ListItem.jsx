import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd-mobile/lib/list';

const ListItem = ({ children, ...props }) => {
  return <List.Item {...props}>{children}</List.Item>;
};

ListItem.propTypes = {
  children: PropTypes.node
};

export default ListItem;
