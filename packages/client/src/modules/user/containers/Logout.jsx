import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'react-apollo';
import { HeaderTitle } from '../../common/components/native';

import translate from '../../../i18n';
import { withLogout } from './Auth';
import { withAppContext } from '../../../../../mobile/src/appContext';

const LogoutView = ({ logout, t, navigation, context: { triggerRender } }) => {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <HeaderTitle
        onPress={async () => {
          await logout();
          triggerRender();
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
  context: PropTypes.object,
  navigation: PropTypes.object,
  t: PropTypes.func
};

export default compose(translate('user'), withLogout, withAppContext)(LogoutView);
