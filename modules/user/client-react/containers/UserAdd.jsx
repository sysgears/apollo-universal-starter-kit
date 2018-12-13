import React from 'react';
import { compose, graphql } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import withSubmit from './withSubmit';

import UserAddView from '../components/UserAddView';
import ADD_USER from '../graphql/AddUser.graphql';

class UserAdd extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <UserAddView {...this.props} />;
  }
}

export default compose(
  translate('user'),
  graphql(ADD_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      handleRequest: async input => {
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
)(withSubmit(UserAdd, 'userAdd'));
