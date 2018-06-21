import React from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView } from 'react-native';
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

  constructor(props) {
    super(props);
  }

  state = {
    messages: [],
    userId: 1,
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

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  };

  render() {
    const { message } = this.state;
    const { messages = [], currentUser } = this.props;
    const defaultUser = { id: 0, username: 'Anonymous' };
    const { id, username } = currentUser ? currentUser : defaultUser;
    const formatMessages = messages.map(item => {
      return {
        _id: item.id,
        text: item.text,
        createdAt: item.createdAt,
        user: {
          _id: item.userId ? item.userId : 0,
          name: item.username ? item.username : 'Anonymous'
        }
      };
    });

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
      addMessage: async input => {
        mutate({
          variables: { input: { text: input.text } },
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
              text: input.text,
              username: input.username,
              createdAt: new Date(),
              userId: input.userId,
              id: input.id
            }
          }
        });
      }
    })
  })
)(Chat);
