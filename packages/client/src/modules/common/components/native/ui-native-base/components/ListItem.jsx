import React from 'react';
import PropTypes from 'prop-types';
import { ListItem as ListItemComponent } from 'native-base';

const ListItem = ({ children, onPress, onClick, ...props }) => {
  return (
    <ListItemComponent {...props} onPress={onPress || onClick}>
      {children}
    </ListItemComponent>
  );
};

ListItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  onPress: PropTypes.func
};

export default ListItem;
