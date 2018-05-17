import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import translate from '../../../i18n';

const StandardView = ({ t }) => {
  console.log(t);
  return <View>standard component mobile</View>;
};

StandardView.propTypes = {
  loading: PropTypes.bool.isRequired,
  t: PropTypes.func
};

export default translate('pagination')(StandardView);
