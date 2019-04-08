import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Modal } from '../../../../packages/client/src/modules/common/components/native';

const ModalNotify = ({ notify, callback }) => (
  <Modal isVisible={!!notify} onBackdropPress={callback}>
    <View style={styles.alertTextWrapper}>
      <Text>{notify}</Text>
    </View>
  </Modal>
);

ModalNotify.propTypes = {
  notify: PropTypes.string,
  callback: PropTypes.func
};

const styles = StyleSheet.create({
  alertTextWrapper: {
    backgroundColor: '#fff',
    padding: 10
  }
});

export default ModalNotify;
