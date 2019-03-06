import React from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';

import MESSAGES_SUBSCRIPTION from '../graphql/MessagesSubscription.graphql';

export default Component => {
  return class WithMessagesSubscription extends React.Component {
    static propTypes = {
      messages: PropTypes.object
    };

    render() {
      const { messages } = this.props;
      if (messages) {
        const endCursor = messages.pageInfo.endCursor;
        return (
          <Subscription subscription={MESSAGES_SUBSCRIPTION} variables={{ endCursor }}>
            {({ data, loading }) => {
              if (!loading) {
                return <Component {...this.props} messagesUpdated={data.messagesUpdated} />;
              }
              return <Component {...this.props} />;
            }}
          </Subscription>
        );
      } else {
        return <Component {...this.props} />;
      }
    }
  };
};
