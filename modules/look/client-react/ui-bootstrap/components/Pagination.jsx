import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Pagination as RSPagination,
  PaginationItem as RSPaginationItem,
  PaginationLink as RSPaginationLink
} from 'reactstrap';

import Button from './Button';

const Pagination = ({
  itemsPerPage,
  handlePageChange,
  hasNextPage,
  pagination,
  total,
  loadMoreText,
  defaultPageSize
}) => {
  const [pageNumber, setPageNumber] = useState(1);

  const onItemClick = pageNumber => {
    setPageNumber(pageNumber);
    handlePageChange(pagination, pageNumber);
  };

  const showPreviousPage = e => {
    e.preventDefault();
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber - 1;
        handlePageChange(pagination, newPageNumber);
        return newPageNumber;
      });
    }
  };

  const showNextPage = (e, pagesArray) => {
    e.preventDefault();
    if (pageNumber < pagesArray.length) {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber + 1;
        handlePageChange(pagination, newPageNumber);
        return newPageNumber;
      });
    }
  };

  const renderPaginationItems = pagesArray => {
    return pagesArray.map(itemNumber => (
      <RSPaginationItem
        key={itemNumber.toString()}
        onClick={() => onItemClick(itemNumber)}
        active={pageNumber === itemNumber}
      >
        <RSPaginationLink
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {itemNumber}
        </RSPaginationLink>
      </RSPaginationItem>
    ));
  };

  if (pagination === 'relay') {
    return hasNextPage ? (
      <div>
        <div>
          <small>
            ({itemsPerPage} / {total})
          </small>
        </div>
        <Button id="load-more" color="primary" onClick={() => handlePageChange(pagination, null)}>
          {loadMoreText}
        </Button>
      </div>
    ) : null;
  } else {
    const pagesArray = Array(Math.ceil(total / defaultPageSize))
      .fill(1)
      .map((x, y) => x + y);
    return (
      <RSPagination className="float-right">
        <RSPaginationItem disabled={pageNumber <= 1}>
          <RSPaginationLink previous href="#" onClick={showPreviousPage} className={'bootstrap-pagination-previous'} />
        </RSPaginationItem>
        {renderPaginationItems(pagesArray)}
        <RSPaginationItem disabled={pageNumber >= pagesArray.length}>
          <RSPaginationLink
            next
            href="#"
            onClick={e => showNextPage(e, pagesArray)}
            className={'bootstrap-pagination-next'}
          />
        </RSPaginationItem>
      </RSPagination>
    );
  }
};

Pagination.propTypes = {
  itemsPerPage: PropTypes.number,
  handlePageChange: PropTypes.func,
  hasNextPage: PropTypes.bool,
  pagination: PropTypes.string,
  total: PropTypes.number,
  loadMoreText: PropTypes.string,
  defaultPageSize: PropTypes.number
};

export default Pagination;
