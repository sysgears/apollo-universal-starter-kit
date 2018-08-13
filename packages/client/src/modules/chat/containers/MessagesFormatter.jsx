import React from 'react';
import * as uuidGenerator from 'react-native-uuid';

const messagesFormatter = Component => {
  return props => {
    const { messages } = props;

    if (messages) {
      const formatMessages = messages.edges
        .map(
          ({
            node: { id, text, userId, username, createdAt, uuid, quotedId, image, path, filename, quotedMessage }
          }) => ({
            _id: id ? id : uuidGenerator.v4(),
            text,
            createdAt: new Date(Date.parse(createdAt.replace(' ', 'T'))),
            user: { _id: userId ? userId : uuid, name: username || 'Anonymous' },
            quotedId,
            path,
            filename,
            quotedMessage,
            image,
            loadingImage: path && !image
          })
        )
        .reverse();
      return <Component {...props} messages={{ ...props.messages, edges: formatMessages }} />;
    } else {
      return <Component {...props} />;
    }
  };
};

export default messagesFormatter;
