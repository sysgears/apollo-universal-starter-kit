// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Elements } from 'react-stripe-elements';

import { PageLayout } from '../../common/components/web';
import SubscriptionForm from './SubscriptionForm';

class SubscriptionView extends React.Component {
  onSubmit = subscribe => async values => {
    const result = await subscribe(values);

    if (result.errors) {
      let submitError = {
        _error: 'Transaction failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    const { subscribe } = this.props;

    const renderMetaData = () => (
      <Helmet
        title="Subscription"
        meta={[
          {
            name: 'description',
            content: 'Subscription page'
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Subscription!</h1>
        <Elements>
          <SubscriptionForm onSubmit={this.onSubmit(subscribe)} />
        </Elements>
      </PageLayout>
    );
  }
}

SubscriptionView.propTypes = {
  subscribe: PropTypes.func.isRequired
};

export default SubscriptionView;
