import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import ResetPasswordForm from '../components/ResetPasswordForm';
import translate from '../../../i18n';

class ResetPasswordView extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    t: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  onSubmit = resetPassword => async values => {
    const { errors } = await resetPassword({
      ...values,
      token: this.props.match.params.token
    });

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: this.props.t('resetPass.errorMsg') }
      );
    }
  };

  render() {
    const { resetPassword } = this.props;
    return (
      <View style={styles.container}>
        <ResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  }
});

export default translate('user')(ResetPasswordView);
