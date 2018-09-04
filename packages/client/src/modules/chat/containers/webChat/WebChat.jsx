import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import uuid from 'uuid';

import * as utils from './utils';
//import Actions from './Actions';
import Avatar from './Avatar';
import Bubble from './Bubble';
//import SystemMessage from './SystemMessage';
//import MessageImage from './MessageImage';
import MessageText from './MessageText';
import Composer from './Composer';
import Day from './Day';
import InputToolbar from './InputToolbar';
//import LoadEarlier from './LoadEarlier';
import Message from './Message';
import MessageContainer from './MessageContainer';
import Send from './Send';
import Time from './Time';
import GiftedAvatar from './GiftedAvatar';

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER, TIME_FORMAT, DATE_FORMAT } from './Constant';

class WebChat extends React.Component {
  static append(currentMessages = [], messages, inverted = true) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return inverted ? messages.concat(currentMessages) : currentMessages.concat(messages);
  }

  static prepend(currentMessages = [], messages, inverted = true) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return inverted ? currentMessages.concat(messages) : messages.concat(currentMessages);
  }

  constructor(props) {
    super(props);

    // default values
    this._isMounted = false;
    this._locale = 'en';
    this._messages = [];

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
      messagesContainerHeight: null,
      typingDisabled: false
    };

    this.onSend = this.onSend.bind(this);
    this.getLocale = this.getLocale.bind(this);
    this.onInputTextChanged = this.onInputTextChanged.bind(this);
    this.onInitialLayoutViewLayout = this.onInitialLayoutViewLayout.bind(this);

    this.invertibleScrollViewProps = {
      inverted: this.props.inverted
    };
  }

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
      getLocale: this.getLocale
    };
  }

  UNSAFE_componentWillMount() {
    const { messages, text } = this.props;
    this.setIsMounted(true);
    this.initLocale();
    this.setMessages(messages || []);
    this.setTextFromProp(text);
  }

  UNSAFE_componentWillReceiveProps(nextProps = {}) {
    const { messages, text } = nextProps;
    this.setMessages(messages || []);
    this.setTextFromProp(text);
  }

  componentWillUnmount() {
    this.setIsMounted(false);
  }

  initLocale() {
    if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  setLocale(locale) {
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  setTextFromProp(textProp) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({ text: textProp });
    }
  }

  getTextFromProp(fallback) {
    if (this.props.text === undefined) {
      return fallback;
    }
    return this.props.text;
  }

  setMessages(messages) {
    this._messages = messages;
  }

  getMessages() {
    return this._messages;
  }

  setIsTypingDisabled(value) {
    this.setState({
      typingDisabled: value
    });
  }

  getIsTypingDisabled() {
    return this.state.typingDisabled;
  }

  setIsMounted(value) {
    this._isMounted = value;
  }

  getIsMounted() {
    return this._isMounted;
  }

  renderMessages() {
    return (
      <div>
        <MessageContainer
          {...this.props}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
        />
        {/*{this.renderChatFooter()}*/}
      </div>
    );
  }

  onSend(messages = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    messages = messages.map(message => {
      return {
        ...message,
        user: this.props.user,
        createdAt: new Date(),
        _id: this.props.messageIdGenerator()
      };
    });

    if (shouldResetInputToolbar === true) {
      this.setIsTypingDisabled(true);
      this.resetInputToolbar();
    }

    this.props.onSend(messages);
    // this.scrollToBottom();

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false);
        }
      }, 100);
    }
  }

  resetInputToolbar() {
    if (this.textInput) {
      this.textInput.clear();
    }
    this.notifyInputTextReset();
    const newComposerHeight = MIN_COMPOSER_HEIGHT;
    // const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight
      // messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
    });
  }

  focusTextInput() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  onInputTextChanged(text) {
    if (this.getIsTypingDisabled()) {
      return;
    }
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text);
    }
    // Only set state if it's not being overridden by a prop.
    if (this.props.text === undefined) {
      this.setState({ text });
    }
  }

  notifyInputTextReset() {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('');
    }
  }

  onInitialLayoutViewLayout() {
    this.notifyInputTextReset();
    const newComposerHeight = MIN_COMPOSER_HEIGHT;
    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight
    });
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text),
      composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
      onSend: this.onSend,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: textInput => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength
      }
    };
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return <InputToolbar {...inputToolbarProps} />;
  }

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      const footerProps = {
        ...this.props
      };
      return this.props.renderChatFooter(footerProps);
    }
    return null;
  }

  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderMessages()}
        {this.renderInputToolbar()}
      </div>
    );
    // return <div>{this.renderLoading()}</div>;
  }
}

WebChat.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func
};

WebChat.defaultProps = {
  messages: [],
  text: undefined,
  placeholder: DEFAULT_PLACEHOLDER,
  messageIdGenerator: () => uuid.v4(),
  user: {},
  onSend: () => {},
  locale: null,
  timeFormat: TIME_FORMAT,
  dateFormat: DATE_FORMAT,
  loadEarlier: false,
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  renderLoading: null,
  renderLoadEarlier: null,
  renderAvatar: undefined,
  showUserAvatar: false,
  onPressAvatar: null,
  renderAvatarOnTop: false,
  renderBubble: null,
  renderSystemMessage: null,
  onLongPress: null,
  renderMessage: null,
  renderMessageText: null,
  renderMessageImage: null,
  imageProps: {},
  textInputProps: {},
  listViewProps: {},
  renderCustomView: null,
  renderDay: null,
  renderTime: null,
  renderFooter: null,
  renderChatFooter: null,
  renderInputToolbar: null,
  renderComposer: null,
  renderActions: null,
  renderSend: null,
  renderAccessory: null,
  onPressActionButton: null,
  bottomOffset: 0,
  minInputToolbarHeight: 44,
  onInputTextChanged: null,
  maxInputLength: null,
  inverted: true
};

WebChat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  text: PropTypes.string,
  placeholder: PropTypes.string,
  messageIdGenerator: PropTypes.func,
  user: PropTypes.object,
  onSend: PropTypes.func,
  locale: PropTypes.string,
  timeFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  isAnimated: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  renderLoading: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  onPressAvatar: PropTypes.func,
  renderAvatarOnTop: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  onLongPress: PropTypes.func,
  renderMessage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderMessageImage: PropTypes.func,
  imageProps: PropTypes.object,
  renderCustomView: PropTypes.func,
  renderDay: PropTypes.func,
  renderTime: PropTypes.func,
  renderFooter: PropTypes.func,
  renderChatFooter: PropTypes.func,
  renderInputToolbar: PropTypes.func,
  renderComposer: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderAccessory: PropTypes.func,
  onPressActionButton: PropTypes.func,
  minInputToolbarHeight: PropTypes.number,
  listViewProps: PropTypes.object,
  onInputTextChanged: PropTypes.func,
  maxInputLength: PropTypes.number,
  inverted: PropTypes.bool,
  textInputProps: PropTypes.object
};

export {
  WebChat,
  // Actions,
  Avatar,
  Bubble,
  // SystemMessage,
  // MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  // LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils
};
