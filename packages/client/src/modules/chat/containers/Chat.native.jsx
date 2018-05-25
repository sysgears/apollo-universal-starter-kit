import React from 'react';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import translate from '../../../i18n';
// import ChatView from '../components/ChatView.native';

@translate('chat')
class Chat extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    items: PropTypes.object,
    loadData: PropTypes.func
  };

  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}

export default Chat;
