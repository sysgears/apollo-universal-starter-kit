import React from 'react';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, Clipboard, Platform } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';

import ChatFooter from '../components/ChatFooter';
import CustomViewNative from '../components/CustomView.native';
import RenderCustomActions from '../components/RenderCustomActions';
import { Loading } from '../../common/components/native';
import chatConfig from '../../../../../../config/chat';

export default class ChatOperations extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    t: PropTypes.func,
    messages: PropTypes.object,
    addMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
    editMessage: PropTypes.func,
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
    isQuoted: false,
    quotedMessage: null
  };

  setMessageState = text => {
    this.setState({ message: text });
  };

  onSend = (messages = []) => {
    const { isEdit, messageInfo, message, quotedMessage } = this.state;
    const { addMessage, editMessage, uuid } = this.props;
    const quotedId = quotedMessage && quotedMessage.hasOwnProperty('id') ? quotedMessage.id : null;
    const defQuote = { filename: null, path: null, text: null, username: null, id: quotedId };

    if (isEdit) {
      editMessage({
        ...messageInfo,
        text: message,
        quotedMessage: quotedMessage ? quotedMessage : defQuote,
        uuid
      });
      this.setState({ isEdit: false });
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
      });

      this.setState({ isQuoted: false, quotedMessage: null });
    }
  };

  onLongPress = (context, currentMessage, id, deleteMessage, setEditState) => {
    const { t } = this.props;
    const options = [t('msg.btn.copy'), t('msg.btn.reply')];

    if (id === currentMessage.user._id) {
      options.push(t('msg.btn.edit'), t('msg.btn.delete'));
    }

    context.actionSheet().showActionSheetWithOptions({ options }, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          Clipboard.setString(currentMessage.text);
          break;

        case 1:
          this.setQuotedState(currentMessage);
          break;

        case 2:
          setEditState(currentMessage);
          break;

        case 3:
          deleteMessage({ id: currentMessage._id });
          break;
      }
    });
  };

  setEditState = ({ _id: id, text, createdAt, quotedId, user: { _id: userId, name: username } }) => {
    this.setState({ isEdit: true, message: text, messageInfo: { id, text, createdAt, userId, username, quotedId } });
    this.gc.focusTextInput();
  };

  setQuotedState = ({ _id: id, text, path, filename, user: { name: username } }) => {
    this.setState({ isQuoted: true, quotedMessage: { id, text, path, filename, username } });
    this.gc.focusTextInput();
  };

  renderChatFooter = () => {
    if (this.state.isQuoted) {
      const { quotedMessage } = this.state;
      return <ChatFooter {...quotedMessage} undoQuote={this.clearQuotedState} />;
    }
  };

  clearQuotedState = () => {
    this.setState({ isQuoted: false, quotedMessage: null });
  };

  renderCustomView = chatProps => {
    const { images } = this.props;
    return <CustomViewNative {...chatProps} images={images} />;
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
      const edges = messages ? messages.edges : [];
      const { id = uuid, username = null } = currentUser ? currentUser : {};
      return (
        <View style={{ flex: 1 }}>
          <GiftedChat
            {...chatConfig.giftedChat}
            ref={gc => (this.gc = gc)}
            text={message}
            onInputTextChanged={text => this.setMessageState(text)}
            placeholder={t('input.text')}
            messages={edges}
            renderSend={this.renderSend}
            onSend={this.onSend}
            loadEarlier={messages.totalCount > messages.edges.length}
            onLoadEarlier={this.onLoadEarlier}
            user={{ _id: id, name: username }}
            renderChatFooter={this.renderChatFooter}
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions}
            onLongPress={(context, currentMessage) =>
              this.onLongPress(context, currentMessage, id, deleteMessage, this.setEditState)
            }
          />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? null : 'padding'} keyboardVerticalOffset={120} />
        </View>
      );
    }
  }
}
