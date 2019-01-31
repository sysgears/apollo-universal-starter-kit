import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const CardText = ({ children, ...props }) => (
  <Typography component="p" {...props}>
    {children}
  </Typography>
);

CardText.propTypes = {
  children: PropTypes.node
};

export default CardText;
