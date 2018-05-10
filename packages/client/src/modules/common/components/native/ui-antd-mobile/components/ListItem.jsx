import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';

const ListItem = ({ children, onClick, onPress, ...props }) => {
  return (
    <List.Item {...props} onClick={onPress || onClick}>
      {children}
    </List.Item>
  );
};

ListItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  onPress: PropTypes.func
};

export default ListItem;
