import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '../../common/components/web';
import ChatMessageForm from './ChatMessageForm';

class ChatMessagesView extends React.PureComponent {
  hendleEditMessage = (id, content) => {
    const { onMessageSelect } = this.props;
    onMessageSelect({ id, content });
  };

  hendleDeleteMessage = id => {
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

  render() {
    const { chatId, message, messages } = this.props;

    const columns = [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-message"
              onClick={() => this.hendleEditMessage(record.id, record.content)}
            >
              Edit
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-message"
              onClick={() => this.hendleDeleteMessage(record.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>Messages</h3>
        <ChatMessageForm chatId={chatId} onSubmit={this.onSubmit()} initialValues={message} />
        <h1 />
        <Table dataSource={messages} columns={columns} />
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
