import React from 'react';
import PropTypes from 'prop-types';
import { Button, primary } from '@gqlapp/look-client-react-native';
import { View, Text, StyleSheet } from 'react-native';

import RegisterForm from '../components/RegisterForm';

class RegisterView extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isRegistered: PropTypes.bool,
    handleHideModal: PropTypes.func,
    t: PropTypes.func
  };

  renderModal = () => (
    <View style={styles.modalWrapper}>
      <Text style={styles.modalTitle}>{this.props.t('reg.confirmationMsgTitle')}</Text>
      <Text style={styles.modalBody}>{this.props.t('reg.confirmationMsgBody')}</Text>
      <View style={styles.button}>
        <Button onPress={this.props.handleHideModal} type={primary}>
          {this.props.t('reg.confirmationBtn')}
        </Button>
      </View>
    </View>
  );

  render() {
    const { onSubmit, isRegistered } = this.props;
    return (
      <View style={styles.container}>{isRegistered ? this.renderModal() : <RegisterForm onSubmit={onSubmit} />}</View>
    );
  }
}

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
