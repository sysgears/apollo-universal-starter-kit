import React from 'react';
import PropTypes from 'prop-types';
import { CardText as RSCardText } from 'reactstrap';

const CardText = ({ children, ...props }) => {
  return <RSCardText {...props}>{children}</RSCardText>;
};

CardText.propTypes = {
  children: PropTypes.node
};

export default CardText;
