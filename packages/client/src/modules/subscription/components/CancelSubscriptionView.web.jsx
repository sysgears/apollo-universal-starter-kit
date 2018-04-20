import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../i18n';
import { Button, Alert, CardGroup, CardTitle, CardText } from '../../common/components/web';

class CancelSubscriptionView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    active: PropTypes.bool,
    cancel: PropTypes.func.isRequired,
    t: PropTypes.func
  };

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
    const { loading, active, t } = this.props;
    const { errors } = this.state;

    if (loading) return <p>{t('cancel.load')}</p>;

    return (
      <CardGroup>
        <CardTitle>{t('cancel.title')}</CardTitle>
        <CardText>
          {active && (
            <Button color="danger" onClick={this.onClick} disabled={this.state.cancelling}>
              {t('cancel.btn')}
            </Button>
          )}
          {!active && <span>{t('cancel.msg')}</span>}
          {errors && <Alert color="error">{errors}</Alert>}
        </CardText>
      </CardGroup>
    );
  }
}

export default translate('subscription')(CancelSubscriptionView);
