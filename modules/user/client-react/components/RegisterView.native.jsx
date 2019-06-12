import React from 'react';
import PropTypes from 'prop-types';
import { Button, primary } from '@gqlapp/look-client-react-native';
import { View, Text, StyleSheet } from 'react-native';

import RegisterForm from './RegisterForm';

const RegisterView = ({ onSubmit, isRegistered, t, navigation }) => {
  const renderModal = () => {
    return (
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>{t('reg.confirmationMsgTitle')}</Text>
        <Text style={styles.modalBody}>{t('reg.confirmationMsgBody')}</Text>
        <View style={styles.button}>
          <Button onPress={() => navigation.goBack()} type={primary}>
            {t('reg.confirmationBtn')}
          </Button>
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{isRegistered ? renderModal() : <RegisterForm onSubmit={onSubmit} />}</View>;
};

RegisterView.propTypes = {
  onSubmit: PropTypes.func,
  isRegistered: PropTypes.bool,
  navigation: PropTypes.object,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    flex: 1,
    paddingTop: 10
  }
});

export default RegisterView;
