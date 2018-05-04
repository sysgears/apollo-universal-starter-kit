import React from 'react';
import PropTypes from 'prop-types';
import { Button as NBButton, Text } from 'native-base';
import { StyleSheet } from 'react-native';

const Button = ({ children, onClick, onPress, type, size, ...props }) => {
  const { buttonStyle, textStyle } = styles;
  const btnProps = {
    ...props,
    [type]: true,
    [size]: true,
    block: true,
    onPress: onPress || onClick
  };

  return (
    <NBButton style={buttonStyle} {...btnProps}>
      <Text style={textStyle} numberOfLines={1}>
        {children}
      </Text>
    </NBButton>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: '#0275d8',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  textStyle: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});

Button.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  onPress: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
