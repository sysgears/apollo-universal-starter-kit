import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'native-base';

const MenuButton = ({ navigation }) => {
  return (
    <Button transparent onPress={() => navigation.openDrawer()}>
      <Icon name="ios-menu" style={styles.icon} />
    </Button>
  );
};

MenuButton.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  icon: {
    color: '#0275d8'
  }
});

export default MenuButton;
