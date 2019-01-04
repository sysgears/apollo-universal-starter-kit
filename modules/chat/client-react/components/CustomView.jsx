import React from 'react';
import PropTypes from 'prop-types';

const CustomView = ({
  currentMessage: {
    quotedId,
    quotedMessage,
    user: { _id: currentId }
  },
  user: { _id: userId }
}) => {
  if (quotedId) {
    const { text, username, id } = quotedMessage;
    if (id) {
      const color = userId === currentId ? styles.ownColorText : styles.colorText;
      return (
        <div style={styles.container}>
          <div style={{ ...styles.username, ...color }}>{username ? username : 'Anonymous'}</div>
          <div style={color}>{text}</div>
        </div>
      );
    } else {
      return (
        <div style={styles.container}>
          <div style={styles.status}>{'Deleted message'}</div>
        </div>
      );
    }
  }
  return null;
};
CustomView.propTypes = {
  messages: PropTypes.array,
  currentMessage: PropTypes.object,
  user: PropTypes.object
};
const styles = {
  container: {
    margin: 5,
    paddingBottom: 2,
    borderBottom: '1px solid #00468A',
    fontSize: 12
  },
  status: {
    color: '#333',
    fontStyle: 'italic'
  },
  username: {
    paddingTop: 5,
    fontWeight: '700'
  },
  colorText: {
    color: '#000'
  },
  ownColorText: {
    color: '#fff'
  }
};
export default CustomView;
