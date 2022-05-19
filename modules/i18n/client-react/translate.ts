import React from 'react';

import settings from '@gqlapp/config';

const reactI18next = settings.i18n.enabled ? require('react-i18next') : null;

export const translate = (ns: any) => {
  return (Component: any) => {
    if (settings.i18n.enabled) {
      return reactI18next.withTranslation(ns)(Component);
    }
    // eslint-disable-next-line react/display-name
    return (props: any) => React.createElement(Component, { ...props, t: (key: any) => key });
  };
};

export type TranslateFunction = (msg: string, ...params: any[]) => string;
