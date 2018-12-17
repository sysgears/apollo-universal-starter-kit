import React from 'react';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';
import { translate } from '@module/i18n-client-react';
import { FormikMessageHandler } from '@module/validation-common-react';

import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';
import settings from '../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

class UserEdit extends React.Component {
  onSubmit = async values => {
    const { user, editUser, t, handleError, history, navigation, location } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    await handleError(() => editUser({ id: user.id, ...userValues }), t('userEdit.errorMsg'));

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
  FormikMessageHandler,
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
        try {
          const {
            data: { editUser }
          } = await mutate({
            variables: { input }
          });

          return editUser;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UserEdit);
