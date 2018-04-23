import React from 'react';
import modules from '../';

export default ns => {
  return Component => {
    try {
      if (!modules.data[0].i18n) {
        throw new Error();
      }
      const reactI18next = require('react-i18next');
      if (!reactI18next.getI18n()) {
        throw new Error();
      }
      return reactI18next.translate(ns)(Component);
    } catch (e) {
      // eslint-disable-next-line react/display-name
      return props => React.createElement(Component, { ...props, t: key => key });
    }
  };
};
