import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';
import settings from '../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

class UserEdit extends React.Component {
  propTypes = {
    user: PropTypes.object.isRequired,
    editUser: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    navigation: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  };

  onSubmit = async values => {
    const { user, editUser, t, history, navigation, location } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    try {
      await editUser({ id: user.id, ...userValues });
    } catch (e) {
      throw new FormError(t('userEdit.errorMsg'), e);
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
  };

  render() {
    return <UserEditView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
  translate('user'),
  graphql(USER_QUERY, {
    options: props => {
      const id = Number(props.match ? props.match.params.id : props.navigation.state.params.id);
      return {
        variables: { id }
      };
    },
    props({ data: { loading, user } }) {
      const userPayload = user ? { user: user.user } : {};
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
