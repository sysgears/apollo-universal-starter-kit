import React from 'react';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';

import UserAddView from '../components/UserAddView';
import ADD_USER from '../graphql/AddUser.graphql';
import settings from '../../../../../../settings';
import translate from '../../../i18n';
import UserFormatter from '../helpers/UserFormatter';

class UserAdd extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = async values => {
    const { addUser, t } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.user.auth.certificate.enabled) {
      userValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    const result = await addUser(userValues);

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
    return <UserAddView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
  translate('user'),
  graphql(ADD_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addUser: async input => {
        try {
          const {
            data: { addUser }
          } = await mutate({
            variables: { input }
          });

          if (addUser.errors) {
            return { errors: addUser.errors };
          }

          if (history) {
            return history.push('/users/');
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
)(UserAdd);
