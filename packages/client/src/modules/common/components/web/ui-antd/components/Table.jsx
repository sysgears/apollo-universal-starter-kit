import React from 'react';
import PropTypes from 'prop-types';
import ADTable from 'antd/lib/table';
import { Pagination } from 'antd';
import { Button } from '../components';

const Table = ({ totalCount, loadMoreRows, loadPost, pageInfo, pagination, ...props }) => {
  pagination = pagination !== 'relay';
  return (
    <div>
      <ADTable pagination={false} {...props} rowKey="id" />
      {renderLoadMore(props.dataSource, loadMoreRows, loadPost, pageInfo, pagination, totalCount)}
    </div>
  );
};

const renderLoadMore = (dataSource, loadMoreRows, loadPost, pageInfo, pagination, totalCount) => {
  if (pageInfo.hasNextPage && !pagination) {
    return (
      <div>
        <div>
          <small>
            ({dataSource.length} / {totalCount})
          </small>
        </div>
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      </div>
    );
  } else {
    return <Pagination defaultCurrent={1} total={totalCount} onChange={e => loadPost(e)} />;
  }
};

Table.propTypes = {
  children: PropTypes.node,
  dataSource: PropTypes.array,
  totalCount: PropTypes.number,
  loadMoreRows: PropTypes.func,
  loadPost: PropTypes.func,
  pageInfo: PropTypes.object,
  pagination: PropTypes.string
};

export default Table;
