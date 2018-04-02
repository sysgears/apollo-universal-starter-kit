import React from 'react';
import PropTypes from 'prop-types';

const CardGroup = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

CardGroup.propTypes = {
  children: PropTypes.node
};

export default CardGroup;
