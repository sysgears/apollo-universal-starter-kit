import React from 'react';
import { graphql, compose } from 'react-apollo';

import { EditView } from '../../common/components/crud';
import { ProductTypeSchema } from '../../../../../server/src/modules/productType/schema';
import PRODUCTTYPE_QUERY from '../graphql/ProductTypeQuery.graphql';
import CREATE_PRODUCTTYPE from '../graphql/CreateProductType.graphql';
import UPDATE_PRODUCTTYPE from '../graphql/UpdateProductType.graphql';

class ProductTypeEdit extends React.Component {
  render() {
    return <EditView {...this.props} schema={ProductTypeSchema} />;
  }
}

export default compose(
  graphql(PRODUCTTYPE_QUERY, {
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
    props({ data: { loading, productType } }) {
      return { loading, data: productType };
    }
  }),
  graphql(CREATE_PRODUCTTYPE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const {
            data: { createProductType }
          } = await mutate({
            variables: { data }
          });

          if (createProductType.errors) {
            return { errors: createProductType.errors };
          }

          if (history) {
            return history.push('/productType');
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
  graphql(UPDATE_PRODUCTTYPE, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const {
            data: { updateProductType }
          } = await mutate({
            variables: { data, where }
          });

          if (updateProductType.errors) {
            return { errors: updateProductType.errors };
          }

          if (history) {
            return history.push('/productType');
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
)(ProductTypeEdit);
