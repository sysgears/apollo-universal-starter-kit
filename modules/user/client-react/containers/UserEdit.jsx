import React from 'react';
import { compose, graphql } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import withSubmit from './withSubmit';

import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';

class UserEdit extends React.Component {
  render() {
    return <UserEditView {...this.props} />;
  }
}

export default compose(
  translate('user'),
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
      handleRequest: async input => {
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
)(withSubmit(UserEdit, 'userEdit'));
