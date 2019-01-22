import React from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'react-native';
import { translate } from '@module/i18n-client-react';
import { LayoutCenter } from '@module/look-client-react-native';

const Loading = ({ t }) => (
  <LayoutCenter>
    <View className="text-center">
      <Text>{t('loading')}</Text>
    </View>
  </LayoutCenter>
);

Loading.propTypes = {
  t: PropTypes.func
};

export default translate('user')(Loading);
