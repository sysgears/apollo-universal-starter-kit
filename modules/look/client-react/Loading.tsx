import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '@gqlapp/i18n-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

const Loading = ({ t }: { t: TranslateFunction }) => <div className="text-center">{t('loading')}</div>;

Loading.propTypes = {
  t: PropTypes.func
};

export default translate('look')(Loading);
