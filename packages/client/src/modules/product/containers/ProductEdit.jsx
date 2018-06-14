import React from 'react';
import { graphql, compose } from 'react-apollo';

import { EditView } from '../../common/components/crud';
import { ProductSchema } from '../../../../../server/src/modules/product/schema';
import PRODUCT_QUERY from '../graphql/ProductQuery.graphql';
import CREATE_PRODUCT from '../graphql/CreateProduct.graphql';
import UPDATE_PRODUCT from '../graphql/UpdateProduct.graphql';

class ProductEdit extends React.Component {
  render() {
    return <EditView {...this.props} schema={ProductSchema} />;
  }
}

export default compose(
  graphql(PRODUCT_QUERY, {
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
    props({ data: { loading, product } }) {
      return { loading, data: product };
    }
  }),
  graphql(CREATE_PRODUCT, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const {
            data: { createProduct }
          } = await mutate({
            variables: { data }
          });

          if (createProduct.errors) {
            return { errors: createProduct.errors };
          }

          if (history) {
            return history.push('/product');
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
  graphql(UPDATE_PRODUCT, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const {
            data: { updateProduct }
          } = await mutate({
            variables: { data, where }
          });

          if (updateProduct.errors) {
            return { errors: updateProduct.errors };
          }

          if (history) {
            return history.push('/product');
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
)(ProductEdit);
