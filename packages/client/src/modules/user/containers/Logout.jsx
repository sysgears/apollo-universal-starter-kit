import React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from 'react-native';

import translate from '../../../i18n';
import { withLogout } from './Auth';

class LogoutView extends React.Component {
  render() {
    const { logout, t } = this.props;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button onPress={logout} title={t('mobile.logout')} />
      </View>
    );
  }
}

LogoutView.propTypes = {
  logout: PropTypes.func.isRequired,
  error: PropTypes.string,
  t: PropTypes.func
};

export default translate('user')(withLogout(LogoutView));
