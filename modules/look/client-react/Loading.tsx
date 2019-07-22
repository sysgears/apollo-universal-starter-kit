import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '@gqlapp/i18n-client-react';
import LayoutCenter from './LayoutCenter';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

const Loading = ({ t }: { t: TranslateFunction }) => (
  <LayoutCenter>
    <div className="text-center">{t('loading')}</div>
  </LayoutCenter>
);

Loading.propTypes = {
  t: PropTypes.func
};

export default translate('look')(Loading);
