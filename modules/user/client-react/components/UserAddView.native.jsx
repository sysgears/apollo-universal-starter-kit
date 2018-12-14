import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { translate } from '@module/i18n-client-react';

import UserForm from './UserForm';
import { withLoadedUser } from '../containers/Auth';

class UserAddView extends React.PureComponent {
  static propTypes = {
    addUser: PropTypes.func.isRequired,
    t: PropTypes.func,
    onSubmit: PropTypes.func
  };

  render() {
    return (
      <View style={styles.container}>
        <UserForm
          onSubmit={this.props.onSubmit}
          initialValues={{}}
          shouldDisplayRole={true}
          shouldDisplayActive={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default withLoadedUser(translate('user')(UserAddView));
