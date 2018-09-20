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
          <span style={[styles.username, color]}>{username ? username : 'Anonymous'}</span>
          <span style={color}>{text}</span>
        </div>
      );
    } else {
      return (
        <div style={styles.container}>
          <span style={styles.status}>{'Deleted message'}</span>
        </div>
      );
    }
  }
  return <div />;
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
    borderBottomWidth: 1,
    borderBottomColor: '#00468A'
  },

  uploading: {
    flex: 1,
    justifyContent: 'center',
    width: 150,
    height: 100,
    margin: 3
  },

  status: {
    color: '#333',
    fontStyle: 'italic'
  },

  username: {
    paddingTop: 5,
    fontWeight: '700'
  },

  image: {
    width: 120,
    height: 50
  },

  colorText: {
    color: '#000'
  },

  ownColorText: {
    color: '#fff'
  }
};

export default CustomView;
