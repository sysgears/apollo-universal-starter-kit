import PropTypes from 'prop-types';
import React from 'react';

//import LoadEarlier from './LoadEarlier';
//import Message from './Message';

export default class MessageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderHeaderWrapper = this.renderHeaderWrapper.bind(this);
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      // return <LoadEarlier {...loadEarlierProps} />;
    }
    return null;
  }

  renderRow({ item, index }) {
    if (!item._id && item._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!item.user) {
      if (!item.system) {
        console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
      }
      item.user = {};
    }
    const { messages, ...restProps } = this.props;
    const previousMessage = messages[index + 1] || {};
    const nextMessage = messages[index - 1] || {};

    const messageProps = {
      ...restProps,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left'
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    //return <Message {...messageProps} />;
  }

  renderHeaderWrapper() {
    return <div style={styles.headerWrapper}>{this.renderLoadEarlier()}</div>;
  }

  render() {
    if (this.props.messages.length === 0) {
      return <div style={styles.container} />;
    }

    // const messages = this.props.messages.map(message => this.renderRow(<div key={message.id}>{message.text}</div>));
    const messages = this.props.messages.map(message => <div key={message._id}>{message.text}</div>);
    return (
      <div style={styles.contentContainerStyle}>
        <div style={styles.listStyle}>{messages}</div>
      </div>
    );
  }
}

const styles = {
  contentContainerStyle: {
    justifyContent: 'flex-end'
  },
  headerWrapper: {
    flex: 1
  },
  listStyle: {
    flex: 1
  }
};

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {},
  inverted: true,
  loadEarlier: false,
  listViewProps: {},
  invertibleScrollViewProps: {}
};

MessageContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
  inverted: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  invertibleScrollViewProps: PropTypes.object
};
