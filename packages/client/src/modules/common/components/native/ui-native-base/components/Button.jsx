import React from 'react';
import PropTypes from 'prop-types';
import { Button as NBButton, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import ButtonStyles from '../styles/Button';

const Button = ({ textStyle, children, onClick, onPress, type, size, ...props }) => {
  const btnProps = {
    ...props,
    [type]: true,
    [size]: true,
    block: true,
    onPress: onPress || onClick
  };

  return (
    <NBButton {...btnProps}>
      <Text style={[styles.btnText, textStyle]} numberOfLines={1}>
        {children}
      </Text>
    </NBButton>
  );
};

const styles = StyleSheet.create(ButtonStyles);

Button.propTypes = {
  children: PropTypes.string,
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  type: PropTypes.string,
  size: PropTypes.string,
  onPress: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
