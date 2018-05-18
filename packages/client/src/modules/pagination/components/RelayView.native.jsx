import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import translate from '../../../i18n';

const RelayView = ({ t }) => {
  console.log(t);
  return <View>standard component mobile</View>;
};

RelayView.propTypes = {
  t: PropTypes.func
};

export default translate('pagination')(RelayView);
