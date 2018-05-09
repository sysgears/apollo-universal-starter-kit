import React from 'react';
import { Card } from 'antd-mobile/lib';

const CardHeader = ({ ...props }) => {
  return <Card.Header {...props} />;
};

export default CardHeader;
