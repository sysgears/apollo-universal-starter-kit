import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { HeaderTitle } from '../../common/components/native';

import translate from '../../../i18n';
import { withLogout } from './Auth';

const LogoutView = ({ logout, t }) => {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <HeaderTitle onPress={() => logout()}>{t('mobile.logout')}</HeaderTitle>
    </View>
  );
};

LogoutView.propTypes = {
  logout: PropTypes.func.isRequired,
  error: PropTypes.string,
  t: PropTypes.func
};

export default translate('user')(withLogout(LogoutView));
