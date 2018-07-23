import React from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, Clipboard } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { compose, graphql } from 'react-apollo/index';
import update from 'immutability-helper';
import moment from 'moment';
import { ImagePicker } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';

import translate from '../../../i18n';
import MESSAGES_QUERY from '../graphql/MessagesQuery.graphql';
import ADD_MESSAGE from '../graphql/AddMessage.graphql';
import DELETE_MESSAGE from '../graphql/DeleteMessage.graphql';
import EDIT_MESSAGE from '../graphql/EditMessage.graphql';
import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';
import UPLOAD_IMAGE from '../graphql/UploadImage.graphql';
// import IMAGE_QUERY from '../graphql/ImageQuery.graphql';
import { withUser } from '../../user/containers/AuthBase';
import withUuid from './WithUuid';
import ChatFooter from '../components/ChatFooter.native';
import CustomView from '../components/CustomView.native';
import RenderCustomActions from '../components/RenderCustomActions.native';
import MessageImage from './MessageImage';

function AddMessage(prev, node) {
  // ignore if duplicate
  if (prev.messages.edges.some(message => node.id === message.cursor)) {
    return prev;
  }

  const filteredMessages = prev.messages.edges.filter(message => message.node.id !== null);
  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'MessageEdges'
  };

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount + 1
      },
      edges: {
        $set: [edge, ...filteredMessages]
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

  return update(prev, {
    messages: {
      totalCount: {
        $set: prev.messages.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
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

@translate('chat')
@withUuid
@withUser
class Chat extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    t: PropTypes.func,
    messages: PropTypes.object,
    addMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
    editMessage: PropTypes.func,
    subscribeToMore: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    uuid: PropTypes.string,
    albumUri: PropTypes.string
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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      const endCursor = this.props.messages ? this.props.messages.pageInfo.endCursor : 0;
      const nextEndCursor = nextProps.messages.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToMessageList(nextEndCursor);
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

  pickImage = async props => {
    const { onSend } = props;
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      base64: false
    });

    if (!image.cancelled) {
      const name = this.receiveImageName(image.uri);
      const imageData = new ReactNativeFile({ uri: image.uri, type: 'image/jpeg', name });
      onSend({ image: imageData });
    }
  };

  receiveImageName(uri) {
    const reg = /((\w|-)*.\w*)$/;
    return uri.match(reg)[0];
  }

  onLongPress(context, currentMessage, id, deleteMessage, setEditState) {
    const options = ['Copy Text', 'Reply'];

    if (id === currentMessage.user._id) {
      options.push('Edit', 'Delete');
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
            setEditState(currentMessage.text, currentMessage);
            break;

          case 3:
            deleteMessage({ id: currentMessage._id });
            break;
        }
      }
    );
  }

  setEditState(
    message,
    {
      _id: id,
      text,
      createdAt,
      user: { _id: userId, name: username }
    }
  ) {
    this.setState({ isEdit: true, message, messageInfo: { id, text, createdAt, userId, username } });
    this.gc.focusTextInput();
  }

  setReplyState({ _id: id, text, user: { name: username } }) {
    this.setState({ isReply: true, quotedMessage: { id, text, username } });
    this.gc.focusTextInput();
  }

  renderChatFooter() {
    if (this.state.isReply) {
      const { quotedMessage } = this.state;
      return <ChatFooter {...quotedMessage} undoReply={this.clearReplyState.bind(this)} />;
    }
  }

  clearReplyState() {
    this.setState({ isReply: false, quotedMessage: null });
  }

  renderCustomView() {
    if (this.currentMessage.reply) {
      const quotedMessage = this.messages.filter(item => this.currentMessage.reply === item._id)[0];
      if (quotedMessage) {
        const {
          text,
          user: { name: username }
        } = quotedMessage;
        return <CustomView username={username} text={text} />;
      }
    }
  }

  renderCustomActions(props) {
    return <RenderCustomActions {...props} pickImage={this.pickImage} />;
  }

  render() {
    const { message } = this.state;
    const { currentUser, deleteMessage, uuid, messages } = this.props;
    const anonymous = 'Anonymous';
    const defaultUser = { id: uuid, username: anonymous };
    const { id, username } = currentUser ? currentUser : defaultUser;
    const timeDiff = moment().utcOffset() * 60000;
    const messageEdges = messages ? messages.edges : [];
    const formatMessages = messageEdges.map(
      ({ node: { id: _id, text, userId, username, createdAt, uuid, reply, image } }) => ({
        _id,
        text,
        createdAt: moment(moment(createdAt) + timeDiff),
        user: { _id: userId ? userId : uuid, name: username || anonymous },
        reply,
        image
      })
    );
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          ref={gc => (this.gc = gc)}
          text={message}
          onInputTextChanged={text => this.setMessageState(text)}
          placeholder={'Type a message...'}
          keyboardShouldPersistTaps="never"
          messages={formatMessages}
          onSend={this.onSend}
          user={{ _id: id, name: username }}
          showAvatarForEveryMessage
          renderChatFooter={this.renderChatFooter.bind(this)}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions.bind(this)}
          onLongPress={(context, currentMessage) =>
            this.onLongPress(context, currentMessage, id, deleteMessage, this.setEditState.bind(this))
          }
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} />
      </View>
    );
  }
}

export default compose(
  graphql(MESSAGES_QUERY, {
    options: () => {
      return {
        variables: { limit: 100, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, messages, subscribeToMore, refetch } = data;
      if (error) throw new Error(error);
      return { loading, messages, subscribeToMore, refetch };
    }
  }),
  // graphql(IMAGE_QUERY, {
  //   options: () => {
  //     const id = 1;
  //     return {
  //       variables: { id }
  //     };
  //   },
  //   props({ data: { error, image, subscribeToMore, refetch } }) {
  //     if (error) throw new Error(error);
  //     return { image, subscribeToMore, refetch };
  //   }
  // }),
  graphql(UPLOAD_IMAGE, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      uploadImage: async image => {
        const file = new ReactNativeFile({ uri: image.uri, type: 'image/jpeg', name: 'photo.jpg' });
        try {
          const {
            data: { image: uploadImage }
          } = await mutate({
            variables: { image: file }
          });
          refetch();
          return uploadImage;
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  graphql(ADD_MESSAGE, {
    props: ({ mutate }) => ({
      addMessage: async ({ text, userId, username, uuid, reply, image, id }) => {
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
              createdAt: moment()
                .utc()
                .format('YYYY-MM-DD hh:mm:ss'),
              text: text,
              username: username,
              userId: userId,
              uuid: uuid,
              id: id,
              reply: reply,
              image: null,
              name: null,
              path: null,
              attachment_id: null
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
      editMessage: ({ text, id, createdAt, userId = null, username, uuid }) => {
        mutate({
          variables: { input: { text, id } },
          optimisticResponse: {
            __typename: 'Mutation',
            editMessage: {
              id: id,
              text: text,
              userId: userId,
              username: username,
              createdAt: moment(moment(createdAt) - moment().utcOffset() * 60000).format('YYYY-MM-DD hh:mm:ss'),
              uuid: uuid,
              reply: null,
              name: null,
              path: null,
              attachment_id: null,
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
  MessageImage
)(Chat);
