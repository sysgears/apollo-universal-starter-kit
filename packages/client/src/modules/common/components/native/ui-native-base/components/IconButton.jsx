import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'native-base';
import { Feather } from '@expo/vector-icons';

const IconButton = ({ iconName, style, iconColor, iconSize, ...props }) => {
  return (
    <Button transparent style={[{ alignSelf: 'center' }, style]} {...props}>
      <Icon>
        <Feather name={iconName} size={iconSize} color={iconColor} />
      </Icon>
    </Button>
  );
};

IconButton.propTypes = {
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

export default IconButton;
