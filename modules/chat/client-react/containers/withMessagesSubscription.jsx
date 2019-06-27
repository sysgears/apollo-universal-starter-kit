import React from 'react';
import { Subscription } from 'react-apollo';

import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';

export default Component => {
  return props => {
    const { messages } = props;

    if (messages) {
      const endCursor = messages.pageInfo.endCursor;
      return (
        <Subscription subscription={MESSAGES_SUBSCRIPTION} variables={{ endCursor }}>
          {({ data, loading }) => {
            if (!loading) {
              return <Component {...props} messagesUpdated={data.messagesUpdated} />;
            }
            return <Component {...props} />;
          }}
        </Subscription>
      );
    } else {
      return <Component {...props} />;
    }
  };
};
