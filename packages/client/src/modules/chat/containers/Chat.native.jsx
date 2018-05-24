import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import translate from '../../../i18n';
import ChatView from '../components/ChatView.native';

@translate('pagination')
class Chat extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    items: PropTypes.object,
    loadData: PropTypes.func
  };

  render() {
    return (
      <View>
        <Text>chat container</Text>
        <ChatView />
      </View>
    );
  }
}

export default Chat;
