import React from 'react';
import PropTypes from 'prop-types';
import * as uuidGenerator from 'uuid';

export default (Component) => {
  function MessageFormatter(props) {
    const { messages } = props;

    if (messages) {
      const formattedEdges = messages.edges
        .map(
          ({
            node: { id, text, userId, username, createdAt, uuid, quotedId, image, path, filename, quotedMessage },
          }) => ({
            _id: id || uuidGenerator.v4(),
            text,
            createdAt: new Date(Date.parse(createdAt.replace(' ', 'T'))),
            user: { _id: userId || uuid, name: username || 'Anonymous' },
            quotedId,
            path,
            filename,
            quotedMessage,
            image,
            loadingImage: path && !image,
          })
        )
        .reverse();
      return <Component {...props} messages={{ ...props.messages, edges: formattedEdges }} />;
    }
    return <Component {...props} />;
  }
  MessageFormatter.propTypes = {
    messages: PropTypes.object,
  };
  return MessageFormatter;
};
