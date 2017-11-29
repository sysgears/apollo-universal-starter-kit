import React from 'react';
import PropTypes from 'prop-types';
import { CardBody } from 'reactstrap';

const CardGroup = ({ children, ...props }) => {
  return <CardBody {...props}>{children}</CardBody>;
};

CardGroup.propTypes = {
  children: PropTypes.node
};

export default CardGroup;
