import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd-mobile-rn';
import { Feather } from '@expo/vector-icons';

const IconButton = ({ iconName, iconColor, iconSize, onPress }) => {
  return (
    <Button style={{ borderWidth: 0 }} type="ghost" onClick={onPress}>
      <Feather name={iconName} size={iconSize} color={iconColor} />
    </Button>
  );
};

IconButton.propTypes = {
  navigation: PropTypes.object,
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string
};

export default IconButton;
