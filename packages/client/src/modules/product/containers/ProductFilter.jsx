import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';
import { ProductSchema } from '../../../../../server/src/modules/product/schema';

import PRODUCT_STATE_QUERY from '../graphql/ProductStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class ProductFilter extends React.Component {
  render() {
    return <FilterView {...this.props} schema={ProductSchema} />;
  }
}

export default compose(
  graphql(PRODUCT_STATE_QUERY, {
    props({
      data: {
        productState: { filter }
      }
    }) {
      return removeTypename(filter);
    }
  }),
  graphql(UPDATE_FILTER, {
    props: ({ mutate }) => ({
      onFilterChange(filter) {
        mutate({ variables: { filter } });
      }
    })
  })
)(ProductFilter);
