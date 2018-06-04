import React from 'react';
import PropTypes from 'prop-types';
import translate from '../../../i18n';

import { PageLayout } from '../../common/components/web';

const SubscribersOnlyView = ({ loading, number, t }) => {
  return (
    <PageLayout>
      <h1>{t('subOnly.title')}</h1>
      <p>
        {t('subOnly.msg')} {loading ? t('subOnly.load') : number}.
      </p>
    </PageLayout>
  );
};

SubscribersOnlyView.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number,
  t: PropTypes.func
};

export default translate('subscription')(SubscribersOnlyView);
