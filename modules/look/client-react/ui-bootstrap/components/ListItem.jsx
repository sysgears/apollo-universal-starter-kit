import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';

const ListItem = ({ children, ...props }) => {
  return <ListGroupItem {...props}>{children}</ListGroupItem>;
};

ListItem.propTypes = {
  children: PropTypes.node
};

export default ListItem;
