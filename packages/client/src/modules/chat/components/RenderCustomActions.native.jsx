import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const RenderCustomActions = props => {
  const { pickImage } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={() => pickImage(props)}>
      <FontAwesome name="photo" size={30} style={styles.icon} />
    </TouchableOpacity>
  );
};

RenderCustomActions.propTypes = {
  pickImage: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },

  icon: {
    color: '#000'
  }
});

export default RenderCustomActions;
