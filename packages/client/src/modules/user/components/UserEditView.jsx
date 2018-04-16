import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { pick } from 'lodash';

import settings from '../../../../../../settings';
import UserForm from './UserForm';

export default class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired
  };

  onSubmit = async values => {
    const { user, addUser, editUser } = this.props;
    let result = null;

    let insertValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    insertValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    if (settings.user.auth.certificate.enabled) {
      insertValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    if (user) {
      result = await editUser({ id: user.id, ...insertValues });
    } else {
      result = await addUser(insertValues);
    }

    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Login failed!' }
      );
    }
  };

  render() {
    const { loading, user } = this.props;

    if (loading && !user) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <View style={styles.container}>
          <UserForm onSubmit={this.onSubmit} initialValues={user || {}} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});
