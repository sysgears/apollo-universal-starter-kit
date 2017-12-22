/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { Table, Button } from '../../common/components/web';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import { createColumnFields } from '../../common/util';

class $Module$ListView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    $module$s: PropTypes.object,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired,
    delete$Module$: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  renderMetaData = () => (
    <Helmet
      title="$Module$"
      meta={[
        {
          name: 'description',
          content: '$Module$ page'
        }
      ]}
    />
  );

  renderLoadMore = ($module$s, loadMoreRows) => {
    if ($module$s.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  renderOrderByArrow = name => {
    const { orderBy } = this.props;

    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'desc') {
        return <span className="badge badge-primary">&#8595;</span>;
      } else {
        return <span className="badge badge-primary">&#8593;</span>;
      }
    } else {
      return <span className="badge badge-secondary">&#8645;</span>;
    }
  };

  hendleDelete = id => {
    const { delete$Module$ } = this.props;
    delete$Module$(id);
  };

  orderBy = (e, name) => {
    const { onOrderBy, orderBy } = this.props;

    e.preventDefault();

    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      } else if (orderBy.order === 'desc') {
        return onOrderBy({});
      }
    }

    return onOrderBy({ column: name, order });
  };

  render() {
    const { loading, $module$s, loadMoreRows } = this.props;
    const columns = createColumnFields($Module$Schema, '$module$', this.orderBy, this.renderOrderByArrow);
    return (
      <div>
        <Table
          dataSource={$module$s ? $module$s.edges : null}
          columns={columns}
          pagination={false}
          loading={loading && !$module$s}
        />
        {$module$s && (
          <div>
            <small>
              ({$module$s.edges ? $module$s.edges.length : 0} / {$module$s.pageInfo.totalCount})
            </small>
          </div>
        )}
        {$module$s && this.renderLoadMore($module$s, loadMoreRows)}
      </div>
    );
  }
}

export default $Module$ListView;
