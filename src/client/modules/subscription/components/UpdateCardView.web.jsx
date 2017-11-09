// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Elements } from 'react-stripe-elements';

import { PageLayout } from '../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardForm';

class UpdateCardView extends React.Component {
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
        title="Update Card"
        meta={[
          {
            name: 'description',
            content: 'Update card page'
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Update card!</h1>
        <Elements>
          <SubscriptionCardForm onSubmit={this.onSubmit(updateCard)} action="Update Card" />
        </Elements>
      </PageLayout>
    );
  }
}

UpdateCardView.propTypes = {
  updateCard: PropTypes.func.isRequired
};

export default UpdateCardView;
