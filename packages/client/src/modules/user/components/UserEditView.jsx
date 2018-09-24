import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import UserForm from './UserForm';
import { withLoadedUser } from '../containers/Auth';
import { Loading } from '../../common/components/native';

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    currentUser: PropTypes.object,
    editUser: PropTypes.func.isRequired,
    t: PropTypes.func,
    onSubmit: PropTypes.func
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
            onSubmit={this.props.onSubmit}
            shouldDisplayRole={isNotSelf}
            shouldDisplayActive={isNotSelf}
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
