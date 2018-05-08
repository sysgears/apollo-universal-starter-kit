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
    displayedAmount: PropTypes.number,
    handlePageChange: PropTypes.func,
    hasNextPage: PropTypes.bool,
    pagination: PropTypes.string,
    totalCount: PropTypes.number,
    loadMoreText: PropTypes.string,
    itemsNumber: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    if (this.props.pagination === 'standard') {
      this.props.handlePageChange(this.props.pagination, this.state.pageNumber);
    }
  }

  handleItemClick = pageNumber => {
    this.setState({ pageNumber: pageNumber });
  };

  handleLinkClick = e => {
    e.preventDefault();
  };

  previousPage = e => {
    e.preventDefault();
    if (this.state.pageNumber > 1) {
      this.setState(prevState => {
        return {
          pageNumber: prevState.pageNumber - 1
        };
      });
    }
  };

  nextPage = (e, pagesArray) => {
    e.preventDefault();
    if (this.state.pageNumber < pagesArray.length) {
      this.setState(prevState => {
        return {
          pageNumber: prevState.pageNumber + 1
        };
      });
    }
  };

  renderPaginationItems(pagesArray) {
    return pagesArray.map(pageNumber => (
      <RSPaginationItem
        key={pageNumber.toString()}
        onClick={() => this.handleItemClick(pageNumber)}
        active={this.state.pageNumber === pageNumber}
      >
        <RSPaginationLink href="#" onClick={this.handleLinkClick}>
          {pageNumber}
        </RSPaginationLink>
      </RSPaginationItem>
    ));
  }

  render() {
    const { pageNumber } = this.state;
    const {
      displayedAmount,
      handlePageChange,
      hasNextPage,
      pagination,
      totalCount,
      loadMoreText,
      itemsNumber
    } = this.props;
    if (pagination === 'relay') {
      if (hasNextPage) {
        return (
          <div>
            <div>
              <small>
                ({displayedAmount} / {totalCount})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => handlePageChange(pagination, null)}>
              {loadMoreText}
            </Button>
          </div>
        );
      } else {
        return null;
      }
    } else {
      const pagesArray = Array(Math.ceil(totalCount / itemsNumber))
        .fill(1)
        .map((x, y) => x + y);
      return (
        <RSPagination className="float-right">
          <RSPaginationItem disabled={pageNumber <= 1}>
            <RSPaginationLink
              previous
              href="#"
              onClick={this.previousPage}
              className={'bootstrap-pagination-previous'}
            />
          </RSPaginationItem>
          {this.renderPaginationItems(pagesArray)}
          <RSPaginationItem disabled={pageNumber >= pagesArray.length}>
            <RSPaginationLink
              next
              href="#"
              onClick={e => this.nextPage(e, pagesArray)}
              className={'bootstrap-pagination-next'}
            />
          </RSPaginationItem>
        </RSPagination>
      );
    }
  }
}
