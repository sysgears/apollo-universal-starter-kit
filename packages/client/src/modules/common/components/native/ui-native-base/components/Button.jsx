import React from 'react';
import PropTypes from 'prop-types';
import { Button as NBButton, Text } from 'native-base';

const Button = ({ children, onClick, onPress, type, size, ...props }) => {
  const btnProps = {
    ...props,
    [type]: true,
    [size]: true,
    block: true,
    onPress: onPress || onClick
  };

  return (
    <NBButton {...btnProps}>
      <Text style={{ flex: 1 }} numberOfLines={1}>
        {children}
      </Text>
    </NBButton>
  );
};

Button.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  onPress: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
