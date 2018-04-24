import React from 'react';
import PropTypes from 'prop-types';
import ADTable from 'antd/lib/table';
import { Button } from '../components';

const Table = ({ ...props }) => {
  console.log(props);
  return (
    <div>
      <ADTable {...props} rowKey="id" />
      <div>
        <small>
          ({props.dataSource.length} / {props.totalCount})
        </small>
      </div>
      {renderLoadMore(props.dataSource, props.loadMoreRows, props.pageInfo)}
    </div>
  );
};

const renderLoadMore = (dataSource, loadMoreRows, pageInfo) => {
  if (pageInfo.hasNextPage) {
    return (
      <Button id="load-more" color="primary" onClick={loadMoreRows}>
        Load more ...
      </Button>
    );
  }
};

Table.propTypes = {
  children: PropTypes.node,
  dataSource: PropTypes.array,
  totalCount: PropTypes.number,
  loadMoreRows: PropTypes.func.isRequired,
  pageInfo: PropTypes.object,
  pagination: PropTypes.bool
};

export default Table;
