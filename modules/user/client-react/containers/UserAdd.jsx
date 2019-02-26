import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import UserAddView from '../components/UserAddView';
import ADD_USER from '../graphql/AddUser.graphql';
import settings from '../../../../settings';
import UserFormatter from '../helpers/UserFormatter';

const UserAdd = props => {
  const { addUser, t, history, navigation } = props;

  const onSubmit = async values => {
    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    try {
      await addUser(userValues);
    } catch (e) {
      throw new FormError(t('userAdd.errorMsg'), e);
    }

    if (history) {
      return history.push('/users/');
    }
    if (navigation) {
      return navigation.goBack();
    }
  };

  return <UserAddView onSubmit={onSubmit} {...props} />;
};

UserAdd.propTypes = {
  addUser: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object,
  history: PropTypes.object
};

export default compose(
  translate('user'),
  graphql(ADD_USER, {
    props: ({ mutate }) => ({
      addUser: async input => {
        const { data: addUser } = await mutate({
          variables: { input }
        });
        return addUser;
      }
    })
  })
)(UserAdd);
