import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup as RSListGroup } from 'reactstrap';

const ListGroup = ({ children, ...props }) => {
  return <RSListGroup {...props}>{children}</RSListGroup>;
};

ListGroup.propTypes = {
  children: PropTypes.node
};

export default ListGroup;
