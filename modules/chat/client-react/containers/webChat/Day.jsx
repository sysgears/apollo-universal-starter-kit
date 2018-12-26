import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import Color from './Color';

import { isSameDay } from './utils';
import { DATE_FORMAT } from './Constant';

export default function Day(
  { dateFormat, currentMessage, previousMessage, nextMessage, containerStyle, wrapperStyle, textStyle, inverted },
  context
) {
  if (!isSameDay(currentMessage, inverted ? previousMessage : nextMessage)) {
    return (
      <div style={{ ...styles.container, ...containerStyle }}>
        <div style={wrapperStyle}>
          <span style={{ ...styles.text, ...textStyle }}>
            {moment(currentMessage.createdAt)
              .locale(context.getLocale())
              .format(dateFormat)
              .toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600'
  }
};

Day.contextTypes = {
  getLocale: PropTypes.func
};

Day.defaultProps = {
  currentMessage: {
    createdAt: null
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  dateFormat: DATE_FORMAT
};

Day.propTypes = {
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  textStyle: PropTypes.object,
  dateFormat: PropTypes.string
};
