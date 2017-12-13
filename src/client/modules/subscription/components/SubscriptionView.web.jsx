import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Elements } from 'react-stripe-elements';

import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardForm';
import settings from '../../../../../settings';

export default class SubscriptionView extends React.Component {
  static propTypes = {
    subscribe: PropTypes.func.isRequired
  };

  state = {
    client: !__SSR__ && !__TEST__
  };

  componentDidMount() {
    this.setState({ client: __CLIENT__ });
  }

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
        title={`${settings.app.name} - Subscription`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Subscription page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Subscription!</h1>
          {this.state.client && (
            <Elements>
              <SubscriptionCardForm onSubmit={this.onSubmit(subscribe)} action="Subscribe" />
            </Elements>
          )}
        </LayoutCenter>
      </PageLayout>
    );
  }
}
