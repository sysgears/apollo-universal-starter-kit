import React from 'react';
import PropTypes from 'prop-types';
import { WebChat } from './webChat/WebChat';

export default class ChatOperations extends React.Component {
  static propTypes = {
    messages: PropTypes.object
  };
  render() {
    const { messages } = this.props;
    if (messages) {
      const { edges = [] } = messages;
      return <WebChat messages={edges} />;
    }
    return null;
  }
}
