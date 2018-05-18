import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import translate from '../../../i18n';

const RelayView = () => {
  return (
    <View>
      <Text>standard component mobile</Text>
    </View>
  );
};

RelayView.propTypes = {
  t: PropTypes.func
};

export default translate('pagination')(RelayView);
