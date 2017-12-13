import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Elements } from 'react-stripe-elements';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import SubscriptionCardForm from './SubscriptionCardForm';
import settings from '../../../../../settings';

export default class UpdateCardView extends React.Component {
  static propTypes = {
    updateCard: PropTypes.func.isRequired
  };

  onSubmit = updateCard => async values => {
    const result = await updateCard(values);

    if (result.errors) {
      let submitError = {
        _error: 'Update failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    const { updateCard } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Update Card`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Update card page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Update card!</h1>
          <Elements>
            <SubscriptionCardForm onSubmit={this.onSubmit(updateCard)} action="Update Card" />
          </Elements>
        </LayoutCenter>
      </PageLayout>
    );
  }
}
