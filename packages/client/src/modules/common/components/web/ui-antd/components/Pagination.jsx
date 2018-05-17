import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as ADPagination } from 'antd';
import { Button } from '../components';

/**
 * @return {boolean}
 */
const Pagination = ({
  displayedAmount,
  handlePageChange,
  hasNextPage,
  pagination,
  totalCount,
  loadMoreText,
  itemsNumber
}) => {
  if (pagination === 'relay') {
    return hasNextPage ? (
      <div>
        <div>
          <small>
            ({displayedAmount} / {totalCount})
          </small>
        </div>
        <Button id="load-more" color="primary" onClick={() => handlePageChange(pagination)}>
          {loadMoreText}
        </Button>
      </div>
    ) : null;
  } else {
    return (
      <ADPagination
        defaultCurrent={1}
        defaultPageSize={itemsNumber}
        total={totalCount}
        onChange={pageNumber => handlePageChange(pagination, pageNumber)}
      />
    );
  }
};

Pagination.propTypes = {
  displayedAmount: PropTypes.number,
  handlePageChange: PropTypes.func,
  hasNextPage: PropTypes.bool,
  pagination: PropTypes.string,
  totalCount: PropTypes.number,
  loadMoreText: PropTypes.string,
  itemsNumber: PropTypes.number
};

export default Pagination;
