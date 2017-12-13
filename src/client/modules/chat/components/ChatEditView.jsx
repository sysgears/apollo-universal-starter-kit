import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import ChatForm from './ChatForm';
import ChatMessages from '../containers/ChatMessages';

const onSubmit = (chat, addChat, editChat) => values => {
  if (chat) {
    editChat(chat.id, values.title, values.content);
  } else {
    addChat(values.title, values.content);
  }
};

const ChatEditView = ({ loading, chat, navigation, subscribeToMore, addChat, editChat }) => {
  let chatObj = chat;

  // if new chat was just added read it from router
  if (!chatObj && navigation.state) {
    chatObj = navigation.state.params.chat;
  }

  if (loading && !chatObj) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ChatForm onSubmit={onSubmit(chatObj, addChat, editChat)} initialValues={chatObj ? chatObj : {}} />
        {chatObj && (
          <ChatMessages
            chatId={navigation.state.params.id}
            messages={chatObj.messages}
            subscribeToMore={subscribeToMore}
          />
        )}
      </View>
    );
  }
};

ChatEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  chat: PropTypes.object,
  addChat: PropTypes.func.isRequired,
  editChat: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default ChatEditView;
