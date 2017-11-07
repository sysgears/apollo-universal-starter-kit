import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../common/components/web';

class CancelSubscriptionView extends React.Component {
  state = {
    cancelling: false
  };

  onClick = () => {
    console.log('cancellling');
    this.setState({ cancelling: true });
  };

  render() {
    const { loading, active } = this.props;

    return (
      <div>
        {!loading &&
          active && (
            <Button color="danger" onClick={this.onClick} disabled={this.state.cancelling}>
              Cancel Subscription
            </Button>
          )}
      </div>
    );
  }
}

CancelSubscriptionView.propTypes = {
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool
};

export default CancelSubscriptionView;
