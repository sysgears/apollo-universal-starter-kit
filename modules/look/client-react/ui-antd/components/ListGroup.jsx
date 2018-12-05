import React from 'react';
import PropTypes from 'prop-types';

const ListGroup = ({ children, ...props }) => {
  return <ul {...props}>{children}</ul>;
};

ListGroup.propTypes = {
  children: PropTypes.node
};

export default ListGroup;
