import React from 'react';
import PropTypes from 'prop-types';
import ADTable from 'antd/lib/table';
import { Pagination } from 'antd';
import { Button } from '../components';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

// pagination accepts 'standard' and 'relay' params
const Table = ({ totalCount, loadData, pageInfo, pagination, ...props }) => {
  return (
    <div>
      <ADTable pagination={false} {...props} rowKey="id" />
      {renderLoadMore(props.dataSource, loadData, pageInfo, pagination, totalCount)}
    </div>
  );
};

const renderLoadMore = (dataSource, loadData, pageInfo, pagination, totalCount) => {
  switch (pagination) {
    case RELAY_PAGINATION:
      if (pageInfo.hasNextPage) {
        return (
          <div>
            <div>
              <small>
                ({dataSource.length} / {totalCount})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => loadData(pagination)}>
              Load more ...
            </Button>
          </div>
        );
      }
      break;
    case STANDARD_PAGINATION:
      return <Pagination defaultCurrent={1} total={totalCount} onChange={e => loadData(pagination, e)} />;
  }
};

Table.propTypes = {
  children: PropTypes.node,
  dataSource: PropTypes.array,
  totalCount: PropTypes.number,
  loadData: PropTypes.func,
  pageInfo: PropTypes.object,
  pagination: PropTypes.string
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
