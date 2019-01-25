import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@gqlapp/i18n-client-react';
import { LayoutCenter } from '@gqlapp/look-client-react';

const ActivateUser = ({ t }) => {
  return (
    <LayoutCenter>
      <div> {t('activateUser')} </div>
    </LayoutCenter>
  );
};
ActivateUser.propTypes = {
  t: PropTypes.func
};

export default translate('user')(ActivateUser);
