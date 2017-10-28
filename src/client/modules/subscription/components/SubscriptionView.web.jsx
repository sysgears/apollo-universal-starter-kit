// Web only component

// React
import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

class SubscriptionView extends React.Component {
  state = {
    errors: []
  };

  onSubmit = () => async values => {
    console.log(values);
  };

  render() {
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
      </PageLayout>
    );
  }
}

export default SubscriptionView;
