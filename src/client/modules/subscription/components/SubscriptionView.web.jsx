// Web only component

// React
import React from 'react';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/PageLayout';
import Progress from './Progress';

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
        <Progress step={1} />
        <h1>Subscription!</h1>
      </PageLayout>
    );
  }
}

export default SubscriptionView;
