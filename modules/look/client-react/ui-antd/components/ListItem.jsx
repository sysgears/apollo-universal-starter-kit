import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ children, ...props }) => {
  return <li {...props}>{children}</li>;
};

ListItem.propTypes = {
  children: PropTypes.node
};

export default ListItem;
