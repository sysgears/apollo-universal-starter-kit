import React from 'react';
import { graphql, compose } from 'react-apollo';

import { EditView } from '../../common/components/crud';
import { CategorySchema } from '../../../../../server/src/modules/category/schema';
import CATEGORY_QUERY from '../graphql/CategoryQuery.graphql';
import CREATE_CATEGORY from '../graphql/CreateCategory.graphql';
import UPDATE_CATEGORY from '../graphql/UpdateCategory.graphql';

class CategoryEdit extends React.Component {
  render() {
    return <EditView {...this.props} schema={CategorySchema} />;
  }
}

export default compose(
  graphql(CATEGORY_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        fetchPolicy: 'cache-and-network',
        variables: { where: { id } }
      };
    },
    props({ data: { loading, category } }) {
      return { loading, data: category };
    }
  }),
  graphql(CREATE_CATEGORY, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const {
            data: { createCategory }
          } = await mutate({
            variables: { data }
          });

          if (createCategory.errors) {
            return { errors: createCategory.errors };
          }

          if (history) {
            return history.push('/category');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATE_CATEGORY, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const {
            data: { updateCategory }
          } = await mutate({
            variables: { data, where }
          });

          if (updateCategory.errors) {
            return { errors: updateCategory.errors };
          }

          if (history) {
            return history.push('/category');
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
)(CategoryEdit);
