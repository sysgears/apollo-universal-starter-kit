import React from 'react';
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import translate from '../../../i18n';

const ChatView = () => {
  return (
    <View>
      <Text>chat view</Text>
    </View>
  );
};

ChatView.propTypes = {};

export default translate('chat')(ChatView);
