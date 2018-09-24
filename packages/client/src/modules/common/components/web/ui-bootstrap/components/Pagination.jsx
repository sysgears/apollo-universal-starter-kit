import React from 'react';
import PropTypes from 'prop-types';
import {
  Pagination as RSPagination,
  PaginationItem as RSPaginationItem,
  PaginationLink as RSPaginationLink
} from 'reactstrap';
import { Button } from '../components';

export default class Pagination extends React.Component {
  static propTypes = {
    itemsPerPage: PropTypes.number,
    handlePageChange: PropTypes.func,
    hasNextPage: PropTypes.bool,
    pagination: PropTypes.string,
    total: PropTypes.number,
    loadMoreText: PropTypes.string,
    defaultPageSize: PropTypes.number
  };

  state = { pageNumber: 1, pagination: this.props.pagination };

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.pagination !== prevState.pagination ? { pageNumber: 1, pagination: nextProps.pagination } : null;
  }

  onItemClick = pageNumber => {
    const { handlePageChange, pagination } = this.props;
    this.setState({ pageNumber: pageNumber }, handlePageChange(pagination, pageNumber));
  };

  showPreviousPage = e => {
    e.preventDefault();
    const { handlePageChange, pagination } = this.props;
    const { pageNumber } = this.state;
    if (pageNumber > 1) {
      this.setState(prevState => {
        const newPageNumber = prevState.pageNumber - 1;
        handlePageChange(pagination, newPageNumber);
        return {
          pageNumber: newPageNumber
        };
      });
    }
  };

  showNextPage = (e, pagesArray) => {
    e.preventDefault();
    const { handlePageChange, pagination } = this.props;
    const { pageNumber } = this.state;
    if (pageNumber < pagesArray.length) {
      this.setState(prevState => {
        const newPageNumber = prevState.pageNumber + 1;
        handlePageChange(pagination, newPageNumber);
        return {
          pageNumber: newPageNumber
        };
      });
    }
  };

  renderPaginationItems(pagesArray) {
    return pagesArray.map(pageNumber => (
      <RSPaginationItem
        key={pageNumber.toString()}
        onClick={() => this.onItemClick(pageNumber)}
        active={this.state.pageNumber === pageNumber}
      >
        <RSPaginationLink
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {pageNumber}
        </RSPaginationLink>
      </RSPaginationItem>
    ));
  }

  render() {
    const { pageNumber } = this.state;
    const {
      itemsPerPage,
      handlePageChange,
      hasNextPage,
      pagination,
      total,
      loadMoreText,
      defaultPageSize
    } = this.props;
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
            <RSPaginationLink
              previous
              href="#"
              onClick={this.showPreviousPage}
              className={'bootstrap-pagination-previous'}
            />
          </RSPaginationItem>
          {this.renderPaginationItems(pagesArray)}
          <RSPaginationItem disabled={pageNumber >= pagesArray.length}>
            <RSPaginationLink
              next
              href="#"
              onClick={e => this.showNextPage(e, pagesArray)}
              className={'bootstrap-pagination-next'}
            />
          </RSPaginationItem>
        </RSPagination>
      );
    }
  }
}
