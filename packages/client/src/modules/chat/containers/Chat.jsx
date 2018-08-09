import React from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, Clipboard } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { compose, graphql } from 'react-apollo/index';
import update from 'immutability-helper';

import translate from '../../../i18n';
import MESSAGES_QUERY from '../graphql/MessagesQuery.graphql';
import ADD_MESSAGE from '../graphql/AddMessage.graphql';
import DELETE_MESSAGE from '../graphql/DeleteMessage.graphql';
import EDIT_MESSAGE from '../graphql/EditMessage.graphql';
import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';
import { withUser } from '../../user/containers/AuthBase';
import withUuid from './WithUuid';
import ChatFooter from '../components/ChatFooter';
import CustomView from '../components/CustomView';
import RenderCustomActions from '../components/RenderCustomActions';
import messageImage from './MessageImage';
import messagesFormatter from './MessagesFormatter';
import { Loading } from '../../common/components/native';
import chatConfig from '../../../../../../config/chat';

function AddMessage(prev, node) {
  // ignore if duplicate
  if (prev.messages.edges.some(message => node.id === message.node.id)) {
    return prev;
  }

  const filteredMessages = prev.messages.edges.filter(message => message.node.id !== null);
  const edge = {
    cursor: prev.messages.totalCount,
    node: node,
    __typename: 'MessageEdges'
  };

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount + 1
      },
      edges: {
        $set: [...filteredMessages, edge]
      },
      pageInfo: {
        endCursor: {
          $set: prev.messages.pageInfo.endCursor + 1
        }
      }
    }
  });
}

function DeleteMessage(prev, id) {
  const index = prev.messages.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  const filteredEdges = prev.messages.edges.filter((item, i) => i !== index);
  const updatedEdges = filteredEdges.map((item, i) => (item.cursor > index ? { ...item, cursor: i } : item));

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount - 1
      },
      edges: {
        $set: updatedEdges
      },
      pageInfo: {
        endCursor: {
          $set: prev.messages.pageInfo.endCursor - 1
        }
      }
    }
  });
}

function EditMessage(prev, node) {
  const index = prev.messages.edges.findIndex(x => x.node.id === node.id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'MessageEdges'
  };

  return update(prev, {
    messages: {
      edges: {
        $splice: [[index, 1, edge]]
      }
    }
  });
}

class Chat extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    t: PropTypes.func,
    messages: PropTypes.object,
    addMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
    editMessage: PropTypes.func,
    subscribeToMore: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    uuid: PropTypes.string,
    pickImage: PropTypes.func,
    images: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.subscription = null;
    this.gc = React.createRef();
  }

  state = {
    message: '',
    isEdit: false,
    messageInfo: null,
    isReply: false,
    quotedMessage: null
  };

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      const endCursor = this.props.messages ? this.props.messages.pageInfo.endCursor : 0;
      const prevEndCursor = prevProps.messages ? prevProps.messages.pageInfo.endCursor : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevEndCursor !== endCursor) {
        this.subscription();
        this.subscription = null;
      }
      if (!this.subscription) {
        this.subscribeToMessageList(endCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToMessageList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { endCursor },
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
        } else if (mutation === 'DELETED') {
          newResult = DeleteMessage(prev, node.id);
        } else if (mutation === 'UPDATED') {
          newResult = EditMessage(prev, node);
        }

        return newResult;
      }
    });
  };

  setMessageState = text => {
    this.setState({ message: text });
  };

  onSend = (messages = []) => {
    const { isEdit, messageInfo, message, quotedMessage } = this.state;
    const { addMessage, editMessage, uuid } = this.props;
    const reply = quotedMessage && quotedMessage.hasOwnProperty('id') ? quotedMessage.id : null;

    if (isEdit) {
      editMessage({
        ...messageInfo,
        text: message,
        uuid
      });
      this.setState({ isEdit: false });
    } else {
      const {
        text = '',
        image = null,
        user: { _id: userId, name: username },
        _id: id
      } = messages[0];

      addMessage({
        text,
        username,
        userId,
        id,
        uuid,
        reply,
        image
      });

      this.setState({ isReply: false, quotedMessage: null });
    }
  };

  onLongPress = (context, currentMessage, id, deleteMessage, setEditState) => {
    const { t } = this.props;
    const options = [t('msg.btn.copy'), t('msg.btn.reply')];

    if (id === currentMessage.user._id) {
      options.push(t('msg.btn.edit'), t('msg.btn.delete'));
    }

    context.actionSheet().showActionSheetWithOptions(
      {
        options
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage.text);
            break;

          case 1:
            this.setReplyState(currentMessage);
            break;

          case 2:
            setEditState(currentMessage);
            break;

          case 3:
            deleteMessage({ id: currentMessage._id });
            break;
        }
      }
    );
  };

  setEditState = ({ _id: id, text, createdAt, reply, user: { _id: userId, name: username } }) => {
    this.setState({ isEdit: true, message: text, messageInfo: { id, text, createdAt, userId, username, reply } });
    this.gc.focusTextInput();
  };

  setReplyState = ({ _id: id, text, user: { name: username } }) => {
    this.setState({ isReply: true, quotedMessage: { id, text, username } });
    this.gc.focusTextInput();
  };

  renderChatFooter = () => {
    if (this.state.isReply) {
      const { quotedMessage } = this.state;
      return <ChatFooter {...quotedMessage} undoReply={this.clearReplyState.bind(this)} />;
    }
  };

  clearReplyState = () => {
    this.setState({ isReply: false, quotedMessage: null });
  };

  renderCustomView = chatProps => {
    const { images } = this.props;
    return <CustomView {...chatProps} images={images} />;
  };

  renderSend = chatProps => {
    const { t } = this.props;
    return <Send {...chatProps} label={t('input.btn')} />;
  };

  renderCustomActions = chatProps => {
    const { images } = this.props;
    if (images) {
      return <RenderCustomActions {...chatProps} pickImage={this.props.pickImage} />;
    }
  };

  onLoadEarlier = () => {
    const {
      messages: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;

    if (this.allowDataLoad) {
      if (this.props.messages.pageInfo.hasNextPage) {
        this.allowDataLoad = false;
        return loadData(endCursor + 1, 'add');
      }
    }
  };

  render() {
    const { currentUser, deleteMessage, uuid, messages, loading, t } = this.props;

    if (loading) {
      return <Loading text={t('loading')} />;
    } else {
      this.allowDataLoad = true;
      const { message } = this.state;
      const messagesEdges = messages ? messages.edges : [];
      const { id = uuid, username = null } = currentUser ? currentUser : {};
      return (
        <View style={{ flex: 1 }}>
          <GiftedChat
            {...chatConfig.giftedChat}
            ref={gc => (this.gc = gc)}
            text={message}
            onInputTextChanged={text => this.setMessageState(text)}
            placeholder={t('input.text')}
            messages={messagesEdges}
            renderSend={this.renderSend}
            onSend={this.onSend}
            loadEarlier
            onLoadEarlier={this.onLoadEarlier}
            user={{ _id: id, name: username }}
            renderChatFooter={this.renderChatFooter}
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions}
            onLongPress={(context, currentMessage) =>
              this.onLongPress(context, currentMessage, id, deleteMessage, this.setEditState)
            }
          />
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} />
        </View>
      );
    }
  }
}

export default compose(
  graphql(MESSAGES_QUERY, {
    options: () => {
      return {
        variables: { limit: chatConfig.limit, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, messages, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.messages.totalCount;
            const newEdges = fetchMoreResult.messages.edges;
            const pageInfo = fetchMoreResult.messages.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...newEdges, ...previousResult.messages.edges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              messages: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Messages'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, messages, subscribeToMore, loadData };
    }
  }),
  graphql(ADD_MESSAGE, {
    props: ({ mutate }) => ({
      addMessage: async ({ text, userId, username, uuid, reply, image }) => {
        mutate({
          variables: { input: { text, uuid, reply, attachment: image } },
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
              createdAt: new Date().toISOString(),
              text: text,
              username: username,
              userId: userId,
              uuid: uuid,
              id: null,
              reply: reply,
              name: image ? image.name : null,
              path: image ? image.uri : null
            }
          }
        });
      }
    })
  }),
  graphql(DELETE_MESSAGE, {
    props: ({ mutate }) => ({
      deleteMessage: id => {
        mutate({
          variables: id,
          optimisticResponse: {
            __typename: 'Mutation',
            deleteMessage: {
              id: id,
              __typename: 'Message'
            }
          },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { deleteMessage }
                }
              }
            ) => {
              return DeleteMessage(prev, deleteMessage.id);
            }
          }
        });
      }
    })
  }),
  graphql(EDIT_MESSAGE, {
    props: ({ mutate }) => ({
      editMessage: ({ text, id, createdAt, userId, username, uuid, reply }) => {
        mutate({
          variables: { input: { text, id } },
          optimisticResponse: {
            __typename: 'Mutation',
            editMessage: {
              id: id,
              text: text,
              userId: userId,
              username: username,
              createdAt: createdAt.toISOString(),
              uuid: uuid,
              reply: reply,
              name: null,
              path: null,
              __typename: 'Message'
            }
          },
          updateQueries: {
            messages: (
              prev,
              {
                mutationResult: {
                  data: { editMessage }
                }
              }
            ) => {
              return EditMessage(prev, editMessage);
            }
          }
        });
      }
    })
  }),
  translate('chat'),
  withUuid,
  withUser,
  messageImage,
  messagesFormatter
)(Chat);
