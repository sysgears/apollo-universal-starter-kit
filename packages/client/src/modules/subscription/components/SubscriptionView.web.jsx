import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import translate from '../../../i18n';
import { LayoutCenter, clientOnly } from '../../common/components';
import { PageLayout } from '../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardForm';
import settings from '../../../../../../settings';

const ElementsClientOnly = clientOnly(Elements);

class SubscriptionView extends React.Component {
  static propTypes = {
    subscribe: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = subscribe => async values => {
    const result = await subscribe(values);
    const { t } = this.props;

    if (result.errors) {
      let submitError = {
        _error: t('errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { subscribe, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('subTitle')}</h1>
          <ElementsClientOnly>
            <SubscriptionCardForm onSubmit={this.onSubmit(subscribe)} action={t('action')} />
          </ElementsClientOnly>
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('subscription')(SubscriptionView);
