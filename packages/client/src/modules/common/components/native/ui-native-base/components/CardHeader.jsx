import React from 'react';
import PropTypes from 'prop-types';
import { CardItem as CardItemComponent } from 'native-base';

import CardTitle from './CardTitle';

const CardHeader = ({ title, ...props }) => {
  return (
    <CardItemComponent header {...props}>
      <CardTitle>{title}</CardTitle>
    </CardItemComponent>
  );
};

CardHeader.propTypes = {
  title: PropTypes.string
};

export default CardHeader;
