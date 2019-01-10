import React from 'react';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';
import { translate } from '@module/i18n-client-react';
import { withFormErrorHandler } from '@module/forms-client-react';

import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';
import settings from '../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

class UserEdit extends React.Component {
  onSubmit = async values => {
    const { user, editUser, t, handleFormErrors, history, navigation, location } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    await handleFormErrors(() => editUser({ id: user.id, ...userValues }), t('userEdit.errorMsg'));

    if (history) {
      if (location && location.state && location.state.from === 'profile') {
        return history.push('/profile');
      }
      return history.push('/users');
    }

    if (navigation) {
      return navigation.goBack();
    }
  };

  render() {
    return <UserEditView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
  translate('user'),
  withFormErrorHandler,
  graphql(USER_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, user } }) {
      const userPayload = user ? { user: user.user, errors: user.errors } : {};
      return {
        loading,
        ...userPayload
      };
    }
  }),
  graphql(EDIT_USER, {
    props: ({ mutate }) => ({
      editUser: async input => {
        const {
          data: { editUser }
        } = await mutate({
          variables: { input }
        });

        return editUser;
      }
    })
  })
)(UserEdit);
