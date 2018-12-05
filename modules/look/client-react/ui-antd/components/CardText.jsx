import React from 'react';
import PropTypes from 'prop-types';

const CardText = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

CardText.propTypes = {
  children: PropTypes.node
};

export default CardText;
