import React from 'react';
import settings from '../../../../../settings';

const reactI18next = settings.i18n.enabled ? require('react-i18next') : null;

export default ns => {
  return Component => {
    if (settings.i18n.enabled) {
      return reactI18next.translate(ns)(Component);
    } else {
      // eslint-disable-next-line react/display-name
      return props => React.createElement(Component, { ...props, t: key => key });
    }
  };
};
