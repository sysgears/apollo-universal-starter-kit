import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@module/i18n-client-react';
import { LayoutCenter } from '@module/look-client-react';

class ActivateUser extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;
    return (
      <LayoutCenter>
        <div>
          {t('activateUser')}
          ...
        </div>
      </LayoutCenter>
    );
  }
}

export default translate('user')(ActivateUser);
