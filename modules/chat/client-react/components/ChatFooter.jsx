import React from 'react';
import PropTypes from 'prop-types';

const ChatFooter = ({ text, username, undoQuote }) => (
  <div style={styles.container}>
    <div>
      <div style={styles.username}>{username}</div>
      <div style={styles.text}>{text}</div>
    </div>
    <div onClick={undoQuote} style={styles.closeButton}>
      x
    </div>
  </div>
);

ChatFooter.propTypes = {
  username: PropTypes.string,
  text: PropTypes.string,
  undoQuote: PropTypes.func
};

const styles = {
  container: {
    position: 'relative',
    borderLeft: '5px solid red'
  },

  username: {
    color: 'red',
    paddingLeft: 10,
    paddingTop: 5
  },

  text: {
    color: 'gray',
    paddingLeft: 10,
    paddingTop: 5
  },

  closeButton: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer'
  }
};

export default ChatFooter;
