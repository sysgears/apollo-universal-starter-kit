import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const IconButton = ({ iconName, iconColor, iconSize, ...props }) => {
  return (
    <Button transparent {...props}>
      <Icon>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </Icon>
    </Button>
  );
};

IconButton.propTypes = {
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string
};

export default IconButton;
