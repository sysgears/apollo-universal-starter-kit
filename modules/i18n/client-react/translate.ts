import React from 'react';
import settings from '../../../settings';

// tslint:disable-next-line
const reactI18next = settings.i18n.enabled ? require('react-i18next') : null;

export const translate = (ns: any) => {
  return (Component: any) => {
    if (settings.i18n.enabled) {
      return reactI18next.translate(ns)(Component);
    } else {
      // eslint-disable-next-line react/display-name
      return (props: any) => React.createElement(Component, { ...props, t: (key: any) => key });
    }
  };
};

export type TranslateFunction = (msg: string, ...params: any[]) => string;
