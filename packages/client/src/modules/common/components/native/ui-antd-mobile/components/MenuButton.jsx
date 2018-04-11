import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd-mobile/lib/button';
import { Ionicons } from '@expo/vector-icons';

const MenuButton = ({ navigation }) => {
  return (
    <Button type="ghost" onClick={() => navigation.navigate('DrawerOpen')}>
      <Ionicons name="ios-menu" size={32} color="#0275d8" />
    </Button>
  );
};

MenuButton.propTypes = {
  navigation: PropTypes.object
};

export default MenuButton;
