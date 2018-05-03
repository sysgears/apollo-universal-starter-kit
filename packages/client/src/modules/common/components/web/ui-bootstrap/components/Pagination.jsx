import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default class TablePagination extends React.Component {
  static propTypes = {
    handlePageChange: PropTypes.func,
    pagination: PropTypes.string,
    pagesArray: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    this.props.handlePageChange(this.props.pagination, this.state.pageNumber);
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

  nextPage = e => {
    e.preventDefault();
    if (this.state.pageNumber < this.props.pagesArray.length) {
      this.setState(prevState => {
        return {
          pageNumber: prevState.pageNumber + 1
        };
      });
    }
  };

  renderPaginationItems() {
    return this.props.pagesArray.map(pageNumber => (
      <PaginationItem
        key={pageNumber.toString()}
        onClick={() => this.handleItemClick(pageNumber)}
        active={this.state.pageNumber === pageNumber}
      >
        <PaginationLink href="#" onClick={this.handleLinkClick}>
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));
  }

  render() {
    const { pageNumber } = this.state;
    return (
      <Pagination className="float-right">
        <PaginationItem disabled={pageNumber <= 1}>
          <PaginationLink previous href="#" onClick={this.previousPage} className={'bootstrap-pagination-previous'} />
        </PaginationItem>
        {this.renderPaginationItems()}
        <PaginationItem disabled={pageNumber >= this.props.pagesArray.length}>
          <PaginationLink next href="#" onClick={this.nextPage} className={'bootstrap-pagination-next'} />
        </PaginationItem>
      </Pagination>
    );
  }
}
