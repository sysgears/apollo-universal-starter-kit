import React from 'react';
import PropTypes from 'prop-types';
import { CardItem as CardItemComponent } from 'native-base';

import CardText from './CardText';

const CardFooter = ({ content, ...props }) => {
  return (
    <CardItemComponent footer {...props}>
      <CardText>{content}</CardText>
    </CardItemComponent>
  );
};

CardFooter.propTypes = {
  content: PropTypes.string
};

export default CardFooter;
