import PropTypes from 'prop-types';
import React from 'react';
import Color from './Color';

export default function Send({ text, containerStyle, onSend, children, textStyle, label, alwaysShowSend }) {
  if (alwaysShowSend || text.trim().length > 0) {
    return (
      <div style={containerStyle}>
        {children || (
          <button
            style={[styles.text, textStyle]}
            onClick={() => {
              onSend({ text: text.trim() }, true);
            }}
          >
            {label}
          </button>
        )}
      </div>
    );
  }
  return <div />;
}

const styles = {
  text: {
    color: Color.defaultBlue,
    fontWeight: 600,
    fontSize: '17px',
    backgroundColor: Color.backgroundTransparent,
    marginBottom: '12px',
    marginLeft: '10px',
    marginRight: '10px'
  }
};

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShowSend: false
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  children: PropTypes.element,
  alwaysShowSend: PropTypes.bool
};
