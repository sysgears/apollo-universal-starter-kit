import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from '../../common/components/web';

class CancelSubscriptionView extends React.Component {
  state = {
    cancelling: false,
    errors: null
  };

  onClick = async () => {
    this.setState({ cancelling: true });
    const { errors } = await this.props.cancel();
    if (errors) {
      this.setState({
        cancelling: false,
        errors
      });
    }
  };

  render() {
    const { loading, active } = this.props;
    const { errors } = this.state;

    if (loading) return <p>Loading...</p>;

    return (
      <div>
        <h3>Subscription</h3>
        {active && (
          <Button color="danger" onClick={this.onClick} disabled={this.state.cancelling}>
            Cancel Subscription
          </Button>
        )}
        {!active && <p>You do not have a subscription.</p>}
        {errors && <Alert color="error">{errors.join('\n')}</Alert>}
      </div>
    );
  }
}

CancelSubscriptionView.propTypes = {
  cancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool
};

export default CancelSubscriptionView;
