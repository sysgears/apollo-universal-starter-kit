import React from 'react';

const messagesFormatter = Component => {
  return props => {
    const { messages } = props;

    if (messages) {
      const formatMessages = messages.edges
        .map(({ node: { id: _id, text, userId, username, createdAt, uuid, reply, image, path } }) => {
          const newCreatedAt = (createdAt + '').search(/T/) === -1 ? createdAt.replace(' ', 'T') : createdAt;
          const time = new Date(Date.parse(newCreatedAt));
          return {
            _id,
            text,
            createdAt: time,
            user: { _id: userId ? userId : uuid, name: username || 'Anonymous' },
            reply,
            image,
            loadingImage: path && !image,
            update: reply ? Date.now() : null
          };
        })
        .reverse();
      return <Component {...props} messages={{ ...props.messages, edges: formatMessages }} />;
    } else {
      return <Component {...props} />;
    }
  };
};

export default messagesFormatter;
