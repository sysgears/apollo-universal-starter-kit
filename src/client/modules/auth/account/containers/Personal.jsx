import React from 'react';
import { graphql, compose } from 'react-apollo';

import PersonalForm from '../components/PersonalForm';

import EDIT_USER from '../graphql/EditUser.graphql';

class PersonalEdit extends React.Component {
  render() {
    return <PersonalForm {...this.props} />;
  }
}

export default compose(
  graphql(EDIT_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      savePersonal: async input => {
        try {
          const { data: { editUser } } = await mutate({
            variables: { input }
          });

          if (editUser.errors) {
            return { errors: editUser.errors };
          }

          if (history) {
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
)(PersonalEdit);
