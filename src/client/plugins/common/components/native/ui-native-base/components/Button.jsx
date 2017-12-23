import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { NBButton } from 'native-base';

const Button = ({ children, ...props }) => {
  return (
    <NBButton block {...props}>
      <Text>{children}</Text>
    </NBButton>
  );
};

Button.propTypes = {
  children: PropTypes.node
};

export default Button;
