import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import translate from '../../../i18n';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import SubscriptionCardForm from './SubscriptionCardForm';
import settings from '../../../../../../settings';

class UpdateCardView extends React.Component {
  static propTypes = {
    updateCard: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = updateCard => async values => {
    const result = await updateCard(values);
    const { t } = this.props;

    if (result.errors) {
      let submitError = {
        _error: t('update.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { updateCard, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - ${t('update.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('update.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('update.subTitle')}</h1>
          <Elements>
            <SubscriptionCardForm onSubmit={this.onSubmit(updateCard)} action={t('update.action')} />
          </Elements>
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('subscription')(UpdateCardView);
