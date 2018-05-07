import React from 'react';
import PropTypes from 'prop-types';
import { CardItem } from 'native-base';

import CardTitle from './CardTitle';

const CardHeader = ({ title, ...props }) => {
  return (
    <CardItem header {...props}>
      <CardTitle>{title}</CardTitle>
    </CardItem>
  );
};

CardHeader.propTypes = {
  title: PropTypes.string
};

export default CardHeader;
