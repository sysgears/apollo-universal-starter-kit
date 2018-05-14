import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { pick } from 'lodash';

import translate from '../../../i18n';
import UserForm from './UserForm';
import { withLoadedUser } from '../containers/Auth';
import { Loading } from '../../common/components/native';

import settings from '../../../../../../settings';

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    currentUser: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { user, addUser, editUser, t } = this.props;

    let insertValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    insertValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    if (settings.user.auth.certificate.enabled) {
      insertValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    const result = user ? await editUser({ id: user.id, ...insertValues }) : await addUser(insertValues);

    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('userEdit.errorMsg') }
      );
    }
  };

  render() {
    const { loading, user, t, currentUser } = this.props;

    if (loading && !user) {
      return <Loading text={t('userEdit.loadMsg')} />;
    } else {
      const isNotSelf = !user || (user && user.id !== currentUser.id);
      return (
        <View style={styles.container}>
          <UserForm
            onSubmit={this.onSubmit}
            shouldRoleDisplay={isNotSelf}
            shouldActiveDisplay={isNotSelf}
            initialValues={user || {}}
          />
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

export default withLoadedUser(translate('user')(UserEditView));
