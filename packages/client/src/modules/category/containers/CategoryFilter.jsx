import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';
import { CategorySchema } from '../../../../../server/src/modules/category/schema';

import CATEGORY_STATE_QUERY from '../graphql/CategoryStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class CategoryFilter extends React.Component {
  customFields = {
    name: {}
  };

  render() {
    return <FilterView {...this.props} schema={CategorySchema} customFields={this.customFields} />;
  }
}

export default compose(
  graphql(CATEGORY_STATE_QUERY, {
    props({
      data: {
        categoryState: { filter }
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
)(CategoryFilter);
