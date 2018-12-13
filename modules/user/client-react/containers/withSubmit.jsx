import React from 'react';
import PropTypes from 'prop-types';
import { FieldError } from '@module/validation-common-react';
import { pick } from 'lodash';

import UserFormatter from '../helpers/UserFormatter';
import settings from '../../../../settings';

export default (Component, type) => {
  return class WithSubmit extends React.Component {
    static propTypes = {
      handleRequest: PropTypes.func,
      t: PropTypes.func
    };
    state = {
      sent: false
    };

    onSubmit = async values => {
      const { handleRequest, t, user } = this.props;

      let query;

      if (type === 'forgotPass') this.setState({ sent: true });

      let userValues;
      if (type === 'userEdit' || type === 'userAdd') {
        userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

        userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

        userValues = UserFormatter.trimExtraSpaces(userValues);

        if (settings.user.auth.certificate.enabled) {
          userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
        }
      }

      if (type === 'resetPass') {
        query = { ...values, token: this.props.match.params.token };
      } else if (type === 'userAdd') {
        query = userValues;
      } else if (type === 'userEdit') {
        query = { id: user.id, ...userValues };
      } else {
        query = values;
      }

      const errors = new FieldError((await handleRequest(query)).errors);
      if (errors.hasAny()) throw { ...errors.errors, messageErr: t(`${type}.errorMsg`) };
    };

    render() {
      const { sent } = this.state;

      return <Component {...this.props} onSubmit={this.onSubmit} sent={sent} />;
    }
  };
};
