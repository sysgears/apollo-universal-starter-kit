import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { pick } from 'lodash';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import UserAddView from '../components/UserAddView';
import ADD_USER from '../graphql/AddUser.graphql';
import UserFormatter from '../helpers/UserFormatter';

class UserAdd extends React.Component {
  propTypes = {
    addUser: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    navigation: PropTypes.object,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  onSubmit = async values => {
    const { addUser, t, history, navigation } = this.props;

    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

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

  render() {
    return <UserAddView onSubmit={this.onSubmit} {...this.props} />;
  }
}

export default compose(
  translate('firebase'),
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
