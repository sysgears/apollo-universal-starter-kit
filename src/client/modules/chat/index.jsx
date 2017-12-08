import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components/native';

import Chat from './containers/Chat';
import ChatEdit from './containers/ChatEdit';

import reducers from './reducers';

import Feature from '../connector';

class ChatListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chat list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('ChatEdit', { id: 0 })} />
  });
  render() {
    return <Chat navigation={this.props.navigation} />;
  }
}

ChatListScreen.propTypes = {
  navigation: PropTypes.object
};

class ChatEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} chat`
  });
  render() {
    return <ChatEdit navigation={this.props.navigation} />;
  }
}

ChatEditScreen.propTypes = {
  navigation: PropTypes.object
};

const ChatNavigator = StackNavigator({
  ChatList: { screen: ChatListScreen },
  ChatEdit: { screen: ChatEditScreen }
});

export default new Feature({
  tabItem: {
    Chat: {
      screen: ChatNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-book-outline',
          size: 30
        })
      }
    }
  },
  reducer: { chat: reducers }
});
