import React from 'react';
import PropTypes from 'prop-types';
import { ListItem as NBListItem } from 'native-base';

const ListItem = ({ children, onPress, onClick, ...props }) => {
  return (
    <NBListItem {...props} onPress={onPress || onClick}>
      {children}
    </NBListItem>
  );
};

ListItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  onPress: PropTypes.func
};

export default ListItem;
