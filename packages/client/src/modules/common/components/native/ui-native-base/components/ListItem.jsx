import React from 'react';
import PropTypes from 'prop-types';
import { ListItem as ListItemComponent } from 'native-base';

const ListItem = ({ children, ...props }) => {
  return <ListItemComponent {...props}>{children}</ListItemComponent>;
};

ListItem.propTypes = {
  children: PropTypes.node
};

export default ListItem;
