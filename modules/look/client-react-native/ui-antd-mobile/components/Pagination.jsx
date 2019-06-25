import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Pagination as ADPagination, Button } from 'antd-mobile-rn';
import { Text } from 'react-native';

const Pagination = ({ pagination, handlePageChange, totalPages, hasNextPage, loadMoreText }) => {
  const [pageNumber, setPageNumber] = useState(1);

  const onPageChange = pageNumber => {
    setPageNumber(pageNumber);
    handlePageChange(pagination, pageNumber);
  };

  const onPressLoadMore = () => {
    handlePageChange(pagination, null);
  };

  if (pagination === 'standard') {
    return (
      <ADPagination
        total={totalPages}
        current={pageNumber}
        locale={{ prevText: '<', nextText: '>' }}
        onChange={pageNumber => onPageChange(pageNumber)}
      />
    );
  } else {
    return hasNextPage ? (
      <Button type="primary" onClick={onPressLoadMore}>
        <Text>{loadMoreText}</Text>
      </Button>
    ) : null;
  }
};

Pagination.propTypes = {
  totalPages: PropTypes.number,
  handlePageChange: PropTypes.func,
  pagination: PropTypes.string,
  loadMoreText: PropTypes.string,
  hasNextPage: PropTypes.bool
};

export default Pagination;
