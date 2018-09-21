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
    showActionSheet: true
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

    this.setState({ showActionSheet: !this.state.showActionSheet });
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
        quotedMessage: quotedMessage ? quotedMessage : defQuote,
        attachment
      });

      this.setState({ isQuoted: false, quotedMessage: null });
    }
  };

  renderCustomView = chatProps => {
    return <CustomView {...chatProps} />;
  };

  renderActionSheet = () => {
    return this.state.showActionSheet ? (
      <div>
        <Button id="apollo-link-button" color="primary">
          Copy
        </Button>
        <Button id="apollo-link-button" color="primary">
          Edit
        </Button>
        <Button id="apollo-link-button" color="primary">
          Reply
        </Button>
        <Button id="apollo-link-button" color="primary">
          Delete
        </Button>
        <Button id="apollo-link-button" color="primary">
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
          onLongPress={(context, currentMessage) =>
            this.onLongPress(context, currentMessage, id, deleteMessage, this.setEditState)
          }
        />
        {this.renderActionSheet()}
      </div>
    );
  }
}
