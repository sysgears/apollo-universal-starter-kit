import React from 'react';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';

import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';
import settings from '../../../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

class UserEdit extends React.Component {
  onSubmit = async values => {
    const { user, editUser, t } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    const result = editUser({ id: user.id, ...userValues });

    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('userEdit.errorMsg') }
      );
    }
  };

  render() {
    return <UserEditView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
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
    props: ({ ownProps: { history, navigation, location }, mutate }) => ({
      editUser: async input => {
        try {
          const {
            data: { editUser }
          } = await mutate({
            variables: { input }
          });
          if (editUser.errors) {
            return { errors: editUser.errors };
          }
          if (history) {
            if (location && location.state && location.state.from === 'profile') {
              return history.push('/profile');
            }
            return history.push('/users');
          }

          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UserEdit);
