import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { reset } from 'redux-form';

import ChatMessagesView from '../components/ChatMessagesView';

import CURRENT_USER_QUERY from '../../user/graphql/CurrentUserQuery.graphql';

import ADD_MESSAGE from '../graphql/AddMessage.graphql';
import EDIT_MESSAGE from '../graphql/EditMessage.graphql';
import DELETE_MESSAGE from '../graphql/DeleteMessage.graphql';
import MESSAGE_SUBSCRIPTION from '../graphql/MessageSubscription.graphql';

function AddMessage(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.chat.messages.some(message => node.id === message.id)) {
    return prev;
  }

  return update(prev, {
    chat: {
      messages: {
        $push: [node]
      }
    }
  });
}

function DeleteMessage(prev, id) {
  const index = prev.chat.messages.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    chat: {
      messages: {
        $splice: [[index, 1]]
      }
    }
  });
}

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.chatId !== nextProps.chatId) {
      this.subscription = null;
    }

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.subscribeToMessageList(nextProps.chatId);
    }
  }

  subscribeToMessageList = chatId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { chatId },
      updateQuery: (prev, { subscriptionData: { data: { messageUpdated: { mutation, id, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddMessage(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteMessage(prev, id);
        }

        return newResult;
      }
    });
  };

  componentWillUnmount() {
    this.props.onMessageSelect({ id: null, content: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  render() {
    return <ChatMessagesView {...this.props} />;
  }
}

ChatMessages.propTypes = {
  chatId: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
  message: PropTypes.object.isRequired,
  onMessageSelect: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

const ChatMessagesWithApollo = compose(
  graphql(CURRENT_USER_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props({ data: { loading, error, currentUser } }) {
      if (error) throw new Error(error);
      return { loading, currentUser };
    }
  }),
  graphql(ADD_MESSAGE, {
    props: ({ mutate }) => ({
      addMessage: (content, chatId) =>
        mutate({
          variables: { input: { content, chatId } },
          optimisticResponse: {
            __typename: 'Mutation',
            addMessage: {
              __typename: 'Message',
              id: null,
              content: content
            }
          },
          updateQueries: {
            chat: (prev, { mutationResult: { data: { addMessage } } }) => {
              if (prev.chat) {
                return AddMessage(prev, addMessage);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_MESSAGE, {
    props: ({ ownProps: { chatId }, mutate }) => ({
      editMessage: (id, content) =>
        mutate({
          variables: { input: { id, chatId, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            editMessage: {
              __typename: 'Message',
              id: id,
              content: content
            }
          }
        })
    })
  }),
  graphql(DELETE_MESSAGE, {
    props: ({ ownProps: { chatId }, mutate }) => ({
      deleteMessage: id =>
        mutate({
          variables: { input: { id, chatId } },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteMessage: {
              __typename: 'Message',
              id: id
            }
          },
          updateQueries: {
            chat: (prev, { mutationResult: { data: { deleteMessage } } }) => {
              if (prev.chat) {
                return DeleteMessage(prev, deleteMessage.id);
              }
            }
          }
        })
    })
  })
)(ChatMessages);

export default connect(
  state => ({ message: state.chat.message }),
  dispatch => ({
    onMessageSelect(message) {
      dispatch({
        type: 'MESSAGE_SELECT',
        value: message
      });
    },
    onFormSubmitted() {
      dispatch(reset('message'));
    }
  })
)(ChatMessagesWithApollo);
