import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';
import { SubCategorySchema } from '../../../../../server/src/modules/subCategory/schema';

import SUBCATEGORY_STATE_QUERY from '../graphql/SubCategoryStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class SubCategoryFilter extends React.Component {
  render() {
    return <FilterView {...this.props} schema={SubCategorySchema} />;
  }
}

export default compose(
  graphql(SUBCATEGORY_STATE_QUERY, {
    props({
      data: {
        subCategoryState: { filter }
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
)(SubCategoryFilter);
