import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../common/components/web';
import ChatForm from './ChatForm';
import ChatMessages from '../containers/ChatMessages';
import settings from '../../../../../settings';

const onSubmit = (chat, addChat, editChat) => values => {
  if (chat) {
    editChat(chat.id, values.title, values.content);
  } else {
    addChat(values.title, values.content);
  }
};

const ChatEditView = ({ loading, chat, match, location, subscribeToMore, addChat, editChat }) => {
  let chatObj = chat;

  // if new chat was just added read it from router
  if (!chatObj && location.state) {
    chatObj = location.state.chat;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit chat`}
      meta={[
        {
          name: 'description',
          content: 'Edit chat example page'
        }
      ]}
    />
  );

  if (loading && !chatObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/chats">
          Back
        </Link>
        <h2>{chat ? 'Edit' : 'Create'} Chat</h2>
        <ChatForm onSubmit={onSubmit(chatObj, addChat, editChat)} initialValues={chatObj} />
        <br />
        {chatObj && (
          <ChatMessages
            chatId={Number(match.params.id)}
            messages={chatObj.messages}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayout>
    );
  }
};

ChatEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  chat: PropTypes.object,
  addChat: PropTypes.func.isRequired,
  editChat: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

export default ChatEditView;
