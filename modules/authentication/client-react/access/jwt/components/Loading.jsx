import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '@module/i18n-client-react';
import { LayoutCenter } from '@module/look-client-react';

const Loading = ({ t }) => (
  <LayoutCenter>
    <div className="text-center">{t('loading')}</div>
  </LayoutCenter>
);

Loading.propTypes = {
  t: PropTypes.func
};

export default translate('auth')(Loading);
