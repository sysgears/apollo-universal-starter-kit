import React from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, Clipboard } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { compose, graphql } from 'react-apollo/index';
import update from 'immutability-helper';

import translate from '../../../i18n';
import MESSAGES_QUERY from '../graphql/MessagesQuery.graphql';
import ADD_MESSAGE from '../graphql/AddMessage.graphql';
import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';
import { withUser } from '../../user/containers/AuthBase';

function AddMessage(prev, node) {
  // ignore if duplicate
  if (prev.messages.some(message => node.id === message.id)) {
    return prev;
  }

  return update(prev, {
    messages: {
      $set: [node, ...prev.messages]
    }
  });
}

@translate('chat')
@withUser
class Chat extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    messages: PropTypes.array,
    addMessage: PropTypes.func,
    subscribeToMore: PropTypes.func.isRequired,
    currentUser: PropTypes.object
  };

  state = {
    message: ''
  };

  componentWillReceiveProps() {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription) {
      this.subscription();
      this.subscription = null;
    } else {
      // Subscribe or re-subscribe
      this.subscribeToMessages();
    }
  }

  subscribeToMessages = () => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,

      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              messagesUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;
        if (mutation === 'CREATED') {
          newResult = AddMessage(prev, node);
        }

        return newResult;
      }
    });
  };

  setMessageState = text => {
    this.setState({ message: text });
  };

  onSend = (messages = [], addMessage) => {
    const {
      text,
      user: { _id: userId, name: username },
      _id: id
    } = messages[0];

    addMessage({
      text,
      username,
      userId,
      id
    });
  };

  onLongPress(context, currentMessage) {
    const options = ['Copy Text', 'Edit', 'Delete', 'Cancel'];

    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage.text);
            break;
        }
      }
    );
  }

  render() {
    const { message } = this.state;
    const { messages = [], currentUser } = this.props;
    const anonymous = 'Anonymous';
    const defaultUser = { id: null, username: anonymous };
    const { id, username } = currentUser ? currentUser : defaultUser;
    const formatMessages = messages.map(({ id: _id, text, userId, username, createdAt }) => ({
      _id,
      text,
      createdAt,
      user: { _id: userId, name: username || anonymous }
    }));

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          text={message}
          onInputTextChanged={text => this.setMessageState(text)}
          placeholder={'Type a message...'}
          keyboardShouldPersistTaps="never"
          messages={formatMessages}
          onSend={messages => this.onSend(messages, this.props.addMessage)}
          user={{ _id: id, name: username }}
          onLongPress={(context, currentMessage) => this.onLongPress(context, currentMessage)}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} />
      </View>
    );
  }
}

export default compose(
  graphql(MESSAGES_QUERY, {
    props: ({ data }) => {
      const { error, messages, subscribeToMore } = data;
      if (error) throw new Error(error);
      return { messages, subscribeToMore };
    }
  }),
  graphql(ADD_MESSAGE, {
    props: ({ mutate }) => ({
      addMessage: async ({ text, userId, username, id }) => {
        mutate({
          variables: { input: { text, userId } },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { addMessage }
                }
              }
            ) => {
              return AddMessage(prev, addMessage);
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addMessage: {
              __typename: 'Message',
              createdAt: new Date(),
              text: text,
              username: username,
              userId: userId,
              id: id
            }
          }
        });
      }
    })
  })
)(Chat);
