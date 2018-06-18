import React from 'react';
import { graphql, compose } from 'react-apollo';

import { EditView } from '../../common/components/crud';
import { SubCategorySchema } from '../../../../../server/src/modules/subCategory/schema';
import SUBCATEGORY_QUERY from '../graphql/SubCategoryQuery.graphql';
import CREATE_SUBCATEGORY from '../graphql/CreateSubCategory.graphql';
import UPDATE_SUBCATEGORY from '../graphql/UpdateSubCategory.graphql';

class SubCategoryEdit extends React.Component {
  render() {
    return <EditView {...this.props} schema={SubCategorySchema} />;
  }
}

export default compose(
  graphql(SUBCATEGORY_QUERY, {
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
    props({ data: { loading, subCategory } }) {
      return { loading, data: subCategory };
    }
  }),
  graphql(CREATE_SUBCATEGORY, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const {
            data: { createSubCategory }
          } = await mutate({
            variables: { data }
          });

          if (createSubCategory.errors) {
            return { errors: createSubCategory.errors };
          }

          if (history) {
            return history.push('/subCategory');
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
  graphql(UPDATE_SUBCATEGORY, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const {
            data: { updateSubCategory }
          } = await mutate({
            variables: { data, where }
          });

          if (updateSubCategory.errors) {
            return { errors: updateSubCategory.errors };
          }

          if (history) {
            return history.push('/subCategory');
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
)(SubCategoryEdit);
