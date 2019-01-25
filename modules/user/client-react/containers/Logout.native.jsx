import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'react-apollo';
import { HeaderTitle } from '@gqlapp/look-client-react-native';
import { translate } from '@gqlapp/i18n-client-react';

import { withLogout } from './Auth';

const LogoutView = ({ logout, t }) => {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <HeaderTitle
        onPress={async () => {
          await logout();
        }}
      >
        {t('mobile.logout')}
      </HeaderTitle>
    </View>
  );
};

LogoutView.propTypes = {
  logout: PropTypes.func.isRequired,
  error: PropTypes.string,
  navigation: PropTypes.object,
  t: PropTypes.func
};

export default compose(
  translate('user'),
  withLogout
)(LogoutView);
