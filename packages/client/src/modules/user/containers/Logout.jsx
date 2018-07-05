import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'react-apollo';
import { HeaderTitle } from '../../common/components/native';

import translate from '../../../i18n';
import { withLogout } from './Auth';

const LogoutView = ({ logout, t, navigation }) => {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <HeaderTitle
        onPress={async () => {
          await logout();
          navigation.navigate('Counter');
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

export default compose(translate('user'), withLogout)(LogoutView);
