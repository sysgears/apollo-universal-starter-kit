import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View, ScrollView, Keyboard } from 'react-native';
import { SwipeAction } from '../../common/components/native';

import ChatMessageForm from './ChatMessageForm';

class ChatMessagesView extends React.PureComponent {
  keyExtractor = item => item.id;

  renderItem = ({ item: { id, content } }) => {
    const { message, deleteMessage, onMessageSelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onMessageSelect({ id: id, content: content })}
        right={{
          text: 'Delete',
          onPress: () => this.onMessageDelete(message, deleteMessage, onMessageSelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  onMessageDelete = (message, deleteMessage, onMessageSelect, id) => {
    if (message.id === id) {
      onMessageSelect({ id: null, content: '' });
    }

    deleteMessage(id);
  };

  onSubmit = (message, chatId, addMessage, editMessage, onMessageSelect, onFormSubmitted) => values => {
    if (message.id === null) {
      addMessage(values.content, chatId);
    } else {
      editMessage(message.id, values.content);
    }

    onMessageSelect({ id: null, content: '' });
    onFormSubmitted();
    Keyboard.dismiss();
  };

  render() {
    const { chatId, message, addMessage, editMessage, messages, onMessageSelect, onFormSubmitted } = this.props;

    return (
      <View>
        <Text style={styles.title}>Messages</Text>
        <ChatMessageForm
          chatId={chatId}
          onSubmit={this.onSubmit(message, chatId, addMessage, editMessage, onMessageSelect, onFormSubmitted)}
          initialValues={message}
        />
        {messages.length > 0 && (
          <ScrollView style={styles.list} keyboardDismissMode="on-drag">
            <FlatList data={messages} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </ScrollView>
        )}
      </View>
    );
  }
}

ChatMessagesView.propTypes = {
  chatId: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
  message: PropTypes.object,
  addMessage: PropTypes.func.isRequired,
  editMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  onMessageSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  list: {
    paddingTop: 10
  }
});

export default ChatMessagesView;
