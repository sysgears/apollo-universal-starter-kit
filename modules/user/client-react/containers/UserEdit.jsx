import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { pick } from 'lodash';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';

import UserEditView from '../components/UserEditView';
import UserFormatter from '../helpers/UserFormatter';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';

const UserEdit = props => {
  const { user, editUser, t, history, navigation } = props;

  const onSubmit = async values => {
    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    try {
      await editUser({ id: user.id, ...userValues });
    } catch (e) {
      throw new FormError(t('userEdit.errorMsg'), e);
    }

    if (history) {
      return history.goBack();
    }

    if (navigation) {
      return navigation.goBack();
    }
  };

  return <UserEditView onSubmit={onSubmit} {...props} />;
};

UserEdit.propTypes = {
  user: PropTypes.object,
  editUser: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object
};

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
