import React from 'react';
import PropTypes from 'prop-types';
import { LayoutCenter, PageLayout } from '@module/look-client-react';
import Helmet from 'react-helmet';
import { Menu, Item, contextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import chatConfig from '../../../../config/chat';
import { WebChat } from './webChat/WebChat';
import settings from '../../../../settings';
import CustomView from '../components/CustomView';

export default class extends React.Component {
  static propTypes = {
    // loading: PropTypes.bool.isRequired,
    t: PropTypes.func,
    messages: PropTypes.object,
    addMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
    editMessage: PropTypes.func,
    // loadData: PropTypes.func.isRequired,
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
    activeMessage: null,
    currentMessage: null
  };

  setMessageState = text => {
    this.setState({ message: text });
  };

  onLongPress = (context, currentMessage, id) => {
    context.preventDefault();

    this.setState({
      isOwnMessage: id === currentMessage.user._id,
      ...(currentMessage._id === this.state.activeMessage
        ? { currentMessage: null, activeMessage: null }
        : { currentMessage, activeMessage: currentMessage._id })
    });

    contextMenu.show({
      id: 'menu',
      event: context
    });
  };

  onSend = (messages = []) => {
    const { isEdit, messageInfo, message, currentMessage } = this.state;
    const { addMessage, editMessage, uuid } = this.props;
    const quotedId = currentMessage && currentMessage.hasOwnProperty('_id') ? currentMessage._id : null;
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
        quotedMessage: this.state.isQuoted ? defQuote : defQuote
      });

      this.setState({ isQuoted: false, currentMessage: null });
    }
  };

  renderCustomView = chatProps => {
    return <CustomView {...chatProps} />;
  };

  renderActionSheet = () => {
    const { t, deleteMessage } = this.props;
    const { currentMessage, isOwnMessage } = this.state;
    return (
      <Menu id={'menu'}>
        <Item
          onClick={() => {
            this.setState({ isQuoted: true });
          }}
        >
          {t('msg.btn.reply')}
        </Item>
        {isOwnMessage && (
          <React.Fragment>
            <Item onClick={() => {}}>{t('msg.btn.edit')}</Item>
            <Item onClick={() => deleteMessage(currentMessage._id)}>{t('msg.btn.delete')}</Item>
          </React.Fragment>
        )}
      </Menu>
    );
  };

  render() {
    const { currentUser, deleteMessage, uuid, messages, t } = this.props;

    this.allowDataLoad = true;
    const { message } = this.state;
    const edges = messages ? messages.edges : [];
    const { id = uuid, username = null } = currentUser ? currentUser : {};
    return (
      <PageLayout>
        <Helmet
          title={`${settings.app.name} - ${t('title')}`}
          meta={[{ name: 'description', content: `${settings.app.name} - ${t('meta')}` }]}
        />
        <LayoutCenter>
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
              onLongPress={(e, currentMessage) =>
                this.onLongPress(e, currentMessage, id, deleteMessage, this.setEditState)
              }
            />
            {this.renderActionSheet()}
          </div>
        </LayoutCenter>
      </PageLayout>
    );
  }
}
