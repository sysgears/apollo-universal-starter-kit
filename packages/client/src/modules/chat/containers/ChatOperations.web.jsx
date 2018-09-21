import React from 'react';
import PropTypes from 'prop-types';
import { WebChat } from './webChat/WebChat';

import chatConfig from '../../../../../../config/chat';
import CustomView from '../components/CustomView';
import { Button } from '../../common/components/web';

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
    uuid: PropTypes.string
    // pickImage: PropTypes.func,
    // images: PropTypes.bool
  };

  state = {
    message: '',
    isEdit: false,
    messageInfo: null,
    isQuoted: false,
    quotedMessage: null,
    showActionSheet: true,
    activeMessage: null,
    currentMessage: () => {}
  };

  setMessageState = text => {
    this.setState({ message: text });
  };

  onLongPress = (context, currentMessage, id) => {
    const { t } = this.props;
    const options = [t('msg.btn.copy'), t('msg.btn.reply')];

    if (id === currentMessage.user._id) {
      options.push(t('msg.btn.edit'), t('msg.btn.delete'));
    }

    this.setState({ showActionSheet: true, currentMessage, activeMessage: currentMessage._id });
  };

  onSend = (messages = []) => {
    const { isEdit, messageInfo, message, currentMessage } = this.state;
    const { addMessage, editMessage, uuid } = this.props;
    const quotedId = currentMessage && currentMessage.hasOwnProperty('_id') ? currentMessage._id : null;
    console.log('quotedId === ', quotedId);
    const defQuote = { filename: null, path: null, text: null, username: null, id: quotedId };

    if (isEdit) {
      editMessage({
        ...messageInfo,
        text: message,
        quotedMessage: currentMessage ? currentMessage : defQuote,
        uuid
      });
      this.setState({ isEdit: false });
    } else {
      const {
        text = null,
        user: { name: username },
        _id: id
      } = messages[0];

      addMessage({
        text,
        username,
        userId: 1,
        id,
        uuid,
        quotedId,
        quotedMessage: currentMessage ? currentMessage : defQuote
      });

      this.setState({ isQuoted: false, currentMessage: null });
    }
  };

  renderCustomView = chatProps => {
    return <CustomView {...chatProps} />;
  };

  renderActionSheet = () => {
    const { deleteMessage } = this.props;
    const { currentMessage, showActionSheet } = this.state;
    return showActionSheet ? (
      <div>
        <Button color="primary">
          Copy
        </Button>
        <Button color="primary">
          Edit
        </Button>
        <Button color="primary" onClick={() => {
          this.setState({ isQuoted: true });
        }}>
          Reply
        </Button>
        <Button color="primary" onClick={() => deleteMessage({ id: currentMessage._id })}>
          Delete
        </Button>
        <Button color="primary">
          Cancel
        </Button>
      </div>
    ) : null;
  };

  render() {
    const { currentUser, deleteMessage, uuid, messages, t } = this.props;

    this.allowDataLoad = true;
    const { message } = this.state;
    const edges = messages ? messages.edges : [];
    const { id = uuid, username = null } = currentUser ? currentUser : {};
    return (
      <div style={{ backgroundColor: '#eee' }}>
        <WebChat
          {...chatConfig.giftedChat}
          ref={gc => (this.gc = gc)}
          text={message}
          onInputTextChanged={text => this.setMessageState(text)}
          placeholder={t('input.text')}
          messages={edges}
          //renderSend={this.renderSend}
          onSend={this.onSend}
          //loadEarlier={messages.totalCount > messages.edges.length}
          //onLoadEarlier={this.onLoadEarlier}
          user={{ _id: id, name: username }}
          renderChatFooter={this.renderChatFooter}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          activeMessage={this.state.activeMessage}
          onLongPress={(context, currentMessage) =>
            this.onLongPress(context, currentMessage, id, deleteMessage, this.setEditState)
          }
        />
        {this.renderActionSheet()}
      </div>
    );
  }
}
