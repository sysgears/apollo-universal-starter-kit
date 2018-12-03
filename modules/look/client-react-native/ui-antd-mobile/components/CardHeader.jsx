import React from 'react';
import { Card } from 'antd-mobile-rn';

const CardHeader = ({ ...props }) => {
  return <Card.Header {...props} />;
};

export default CardHeader;
