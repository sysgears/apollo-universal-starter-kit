import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { Button, Icon } from 'native-base';

const MenuButton = ({ navigation }) => {
  return (
    <Button style={Platform.OS === 'android' ? styles.button : {}} transparent onPress={() => navigation.openDrawer()}>
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
  },
  button: {
    paddingTop: 13,
    paddingBottom: 0
  }
});

export default MenuButton;
