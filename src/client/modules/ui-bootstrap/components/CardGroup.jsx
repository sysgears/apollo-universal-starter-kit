import React from 'react';
import PropTypes from 'prop-types';
import { CardBlock } from 'reactstrap';

const CardGroup = ({ children, ...props }) => {
  return <CardBlock {...props}>{children}</CardBlock>;
};

CardGroup.propTypes = {
  children: PropTypes.node
};

export default CardGroup;
