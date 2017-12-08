import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from '../../common/components/web';
import ChatMessageForm from './ChatMessageForm';

class ChatMessagesView extends React.PureComponent {
  handleEditMessage = (id, content) => {
    const { onMessageSelect } = this.props;
    onMessageSelect({ id, content });
  };

  handleDeleteMessage = id => {
    const { message, onMessageSelect, deleteMessage } = this.props;

    if (message.id === id) {
      onMessageSelect({ id: null, content: '' });
    }

    deleteMessage(id);
  };

  onSubmit = () => values => {
    const { message, chatId, addMessage, editMessage, onMessageSelect, onFormSubmitted } = this.props;

    if (message.id === null) {
      addMessage(values.content, chatId);
    } else {
      editMessage(message.id, values.content);
    }

    onMessageSelect({ id: null, content: '' });
    onFormSubmitted();
  };

  renderMessage = message => {
    return (
      <Row key={message.id}>
        <Col xs={1}>
          <b>{message.id}</b>
        </Col>
        <Col xs={10}>{message.content}</Col>
        <Col xs={1}>
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-comment"
              onClick={() => this.handleEditMessage(message.id, message.content)}
            >
              Edit
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-comment"
              onClick={() => this.handleDeleteMessage(message.id)}
            >
              Delete
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  renderMessages = messages => {
    return messages.map(message => {
      return this.renderMessage(message);
    });
  };

  render() {
    const { chatId, message, messages } = this.props;

    return (
      <div>
        <h3>Messages</h3>
        <ChatMessageForm chatId={chatId} onSubmit={this.onSubmit()} initialValues={message} />
        <h1 />
        <hr />
        <hr />
        <Container>{this.renderMessages(messages)}</Container>
        <hr />
        <hr />
      </div>
    );
  }
}

ChatMessagesView.propTypes = {
  chatId: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
  message: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  editMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  onMessageSelect: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

export default ChatMessagesView;
