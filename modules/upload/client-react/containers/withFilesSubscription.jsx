import React from 'react';
import { Subscription } from 'react-apollo';

import FILES_SUBSCRIPTION from '../graphql/FilesSubscription.graphql';

export default Component => {
  return class WithFilesSubscription extends React.Component {
    render() {
      return (
        <Subscription subscription={FILES_SUBSCRIPTION}>
          {({ data, loading }) => {
            return <Component {...this.props} filesUpdated={!loading && data ? data.filesUpdated : null} />;
          }}
        </Subscription>
      );
    }
  };
};
