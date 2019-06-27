import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, Clipboard, Platform } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';

import { Loading } from '@gqlapp/look-client-react-native';
import settings from '@gqlapp/config';

import ChatFooter from '../components/ChatFooter';
import CustomView from '../components/CustomView';
import RenderCustomActions from '../components/RenderCustomActions';
import ModalNotify from '../components/ModalNotify';

const Chat = ({
  addMessage,
  editMessage,
  uuid,
  t,
  deleteMessage,
  allowImages,
  loadData,
  messages,
  currentUser,
  loading,
  pickImage
}) => {
  let allowDataLoad = true;

  const gc = useRef(null);
  const [state, setState] = useState({
    message: '',
    isEdit: false,
    messageInfo: null,
    isQuoted: false,
    quotedMessage: null,
    notify: null
  });

  const setMessageState = text => {
    setState({ ...state, message: text });
  };

  const onSend = (messages = []) => {
    const { isEdit, messageInfo, message, quotedMessage } = state;
    const quotedId = quotedMessage && quotedMessage.hasOwnProperty('id') ? quotedMessage.id : null;
    const defQuote = { filename: null, path: null, text: null, username: null, id: quotedId };

    if (isEdit) {
      editMessage({
        ...messageInfo,
        text: message,
        quotedMessage: quotedMessage ? quotedMessage : defQuote,
        uuid
      }).then(res =>
        setState({
          ...state,
          message: '',
          isEdit: false,
          notify: res && res.error ? res.error : null
        })
      );
    } else {
      const {
        text = null,
        attachment,
        user: { _id: userId, name: username },
        _id: id
      } = messages[0];

      addMessage({
        text,
        username,
        userId,
        id,
        uuid,
        quotedId,
        quotedMessage: quotedMessage ? quotedMessage : defQuote,
        attachment
      }).then(res =>
        setState({
          ...state,
          isQuoted: false,
          quotedMessage: null,
          message: '',
          notify: res && res.error ? res.error : null
        })
      );
    }
  };

  const onLongPress = ({ actionSheet }, currentMessage, id) => {
    const { _id: messageId, text, user } = currentMessage;
    const options = [t('msg.btn.copy'), t('msg.btn.reply')];

    if (id === user._id) {
      options.push(t('msg.btn.edit'), t('msg.btn.delete'));
    }

    actionSheet().showActionSheetWithOptions({ options }, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          Clipboard.setString(text);
          break;

        case 1:
          setQuotedState(currentMessage);
          break;

        case 2:
          setEditState(currentMessage);
          break;

        case 3:
          deleteMessage(messageId).then(res => setState({ ...state, notify: res && res.error ? res.error : null }));
          break;
      }
    });
  };

  const setEditState = ({ _id: id, text, createdAt, quotedId, user: { _id: userId, name: username } }) => {
    setState({
      ...state,
      isEdit: true,
      message: text,
      messageInfo: { id, text, createdAt, userId, username, quotedId }
    });
    gc.current.focusTextInput();
  };

  const setQuotedState = ({ _id: id, text, path, filename, user: { name: username } }) => {
    setState({ ...state, isQuoted: true, quotedMessage: { id, text, path, filename, username } });
    gc.current.focusTextInput();
  };

  const clearQuotedState = () => setState({ ...state, isQuoted: false, quotedMessage: null });

  const renderChatFooter = () => {
    const { quotedMessage, isQuoted } = state;
    if (isQuoted) {
      return <ChatFooter {...quotedMessage} undoQuote={clearQuotedState} />;
    }
  };

  const renderCustomView = chatProps => <CustomView {...chatProps} allowImages={allowImages} />;

  const renderSend = chatProps => <Send {...chatProps} label={t('input.btn')} />;

  const renderCustomActions = ({ onSend }) => {
    if (allowImages) {
      return <RenderCustomActions onSend={onSend} pickImage={pickImage} />;
    }
  };

  const onLoadEarlier = () => {
    const {
      pageInfo: { endCursor, hasNextPage }
    } = messages;

    if (allowDataLoad) {
      if (hasNextPage) {
        allowDataLoad = false;
        return loadData(endCursor + 1, 'add');
      }
    }
  };

  const renderModal = () => {
    const { notify } = state;
    if (notify) {
      return <ModalNotify notify={notify} callback={() => setState({ ...state, notify: null })} />;
    }
  };

  if (loading) {
    return <Loading text={t('loading')} />;
  }

  const { message } = state;
  const edges = messages ? messages.edges : [];
  const { id = uuid, username = null } = currentUser ? currentUser : {};

  return (
    <View style={{ flex: 1 }}>
      {renderModal()}
      <GiftedChat
        {...settings.chat.giftedChat}
        ref={gc}
        text={message}
        onInputTextChanged={text => setMessageState(text)}
        placeholder={t('input.text')}
        messages={edges}
        renderSend={renderSend}
        onSend={onSend}
        loadEarlier={messages ? messages.totalCount > messages.edges.length : false}
        onLoadEarlier={onLoadEarlier}
        user={{ _id: id, name: username }}
        renderChatFooter={renderChatFooter}
        renderCustomView={renderCustomView}
        renderActions={renderCustomActions}
        onLongPress={(context, currentMessage) => onLongPress(context, currentMessage, id)}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? null : 'padding'} keyboardVerticalOffset={120} />
    </View>
  );
};

Chat.propTypes = {
  loading: PropTypes.bool.isRequired,
  t: PropTypes.func,
  error: PropTypes.string,
  messages: PropTypes.object,
  addMessage: PropTypes.func,
  deleteMessage: PropTypes.func,
  editMessage: PropTypes.func,
  loadData: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  uuid: PropTypes.string,
  pickImage: PropTypes.func,
  allowImages: PropTypes.bool
};

export default Chat;
