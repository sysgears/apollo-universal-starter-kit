import React from 'react';

export default ns => {
  return Component => {
    try {
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
