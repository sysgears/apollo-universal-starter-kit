import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';
import { ProductTypeSchema } from '../../../../../server/src/modules/productType/schema';

import PRODUCTTYPE_STATE_QUERY from '../graphql/ProductTypeStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class ProductTypeFilter extends React.Component {
  render() {
    return <FilterView {...this.props} schema={ProductTypeSchema} />;
  }
}

export default compose(
  graphql(PRODUCTTYPE_STATE_QUERY, {
    props({
      data: {
        productTypeState: { filter }
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
)(ProductTypeFilter);
