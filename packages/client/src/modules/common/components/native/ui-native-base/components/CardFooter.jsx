import React from 'react';
import PropTypes from 'prop-types';
import { CardItem } from 'native-base';

import CardText from './CardText';

const CardFooter = ({ content, ...props }) => {
  return (
    <CardItem footer {...props}>
      <CardText>{content}</CardText>
    </CardItem>
  );
};

CardFooter.propTypes = {
  content: PropTypes.string
};

export default CardFooter;
