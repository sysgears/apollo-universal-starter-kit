import PropTypes from 'prop-types';
import React from 'react';

import moment from 'moment';

import Color from './Color';
import { TIME_FORMAT } from './Constant';

export default function Time({ position, containerStyle, currentMessage, timeFormat, textStyle }, context) {
  return (
    <div style={[styles[position].container, containerStyle[position]]}>
      <span style={[styles[position].text, textStyle[position]]}>
        {moment(currentMessage.createdAt)
          .locale(context.getLocale())
          .format(timeFormat)}
      </span>
    </div>
  );
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 5
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right'
};

const styles = {
  left: {
    container: {
      ...containerStyle
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle
    }
  },
  right: {
    container: {
      ...containerStyle
    },
    text: {
      color: Color.white,
      ...textStyle
    }
  }
};

Time.contextTypes = {
  getLocale: PropTypes.func
};

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null
  },
  containerStyle: {},
  textStyle: {},
  timeFormat: TIME_FORMAT
};

Time.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object
  }),
  textStyle: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object
  }),
  timeFormat: PropTypes.string
};
