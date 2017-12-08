import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import ChatEditView from '../components/ChatEditView';
import { AddChat } from './Chat';

import CHAT_QUERY from '../graphql/ChatQuery.graphql';
import ADD_CHAT from '../graphql/AddChat.graphql';
import EDIT_CHAT from '../graphql/EditChat.graphql';
import CHAT_SUBSCRIPTION from '../graphql/ChatSubscription.graphql';

class ChatEdit extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      // Check if props have changed and, if necessary, stop the subscription
      console.log(this.props.chat, nextProps.chat);
      if (this.subscription && nextProps.chat && this.props.chat && this.props.chat.id !== nextProps.chat.id) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription && nextProps.chat) {
        this.subscribeToChatEdit(nextProps.chat.id);
      }
    }
  }

  subscribeToChatEdit = chatId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: CHAT_SUBSCRIPTION,
      variables: { id: chatId }
    });
  };

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  render() {
    return <ChatEditView {...this.props} />;
  }
}

ChatEdit.propTypes = {
  loading: PropTypes.bool.isRequired,
  chat: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired
};

export default compose(
  graphql(CHAT_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, chat, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, chat, subscribeToMore };
    }
  }),
  graphql(ADD_CHAT, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addChat: async (title, content) => {
        let chatData = await mutate({
          variables: { input: { title, content } },
          optimisticResponse: {
            __typename: 'Mutation',
            addChat: {
              __typename: 'Chat',
              id: null,
              title: title,
              content: content,
              messages: []
            }
          },
          updateQueries: {
            chats: (prev, { mutationResult: { data: { addChat } } }) => {
              return AddChat(prev, addChat);
            }
          }
        });

        if (history) {
          return history.push('/chat/' + chatData.data.addChat.id, {
            chat: chatData.data.addChat
          });
        } else if (navigation) {
          return navigation.setParams({
            id: chatData.data.addChat.id,
            chat: chatData.data.addChat
          });
        }
      }
    })
  }),
  graphql(EDIT_CHAT, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editChat: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title, content } }
        });

        if (history) {
          return history.push('/chats');
        }
        if (navigation) {
          return navigation.goBack();
        }
      }
    })
  })
)(ChatEdit);
